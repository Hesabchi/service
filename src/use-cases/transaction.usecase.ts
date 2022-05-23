import { UserDb } from "../repository/db/user.db";
import { newTransactionDTO } from "../controllers/dto/transaction.dto";
import { FederationDb } from "../repository/db/federation.db";
import { User } from "../entities/user/user.entity";
import { TransactionDb } from "../repository/db/transaction.db";
import { HorizonService } from "../repository/services/horison.servcie";
import { Exception } from "./../common/handlesErrors/handleError";
import { KuknosService } from "./../repository/services/kuknos.servcie";


export class TransactionUseCase{
    
    private userDb: UserDb
    private federationDb: FederationDb
    private transactionDB: TransactionDb
    private horizonService:HorizonService
    private kuknosService:KuknosService

    constructor(){
        this.userDb = new UserDb();
        this.federationDb = new FederationDb()
        this.transactionDB = new TransactionDb()
        this.horizonService = new HorizonService()
        this.kuknosService = new KuknosService()
    }

    public async newCost(userId: number, data: newTransactionDTO){

        const owner = await this.userDb.findById(userId)

        let amountPerUser: any = data.include_me ? 
            parseFloat(data.amount) / (data.users.length + 1) :
            parseFloat(data.amount) / data.users.length

        amountPerUser = amountPerUser.toFixed(2)

        const transaction = await this.transactionDB.createTransaction({
            amount: data.amount,
            owner: owner,
            title: data.title
        })
        
        await Promise.all(data.users.map(async (publicKey)=>{
            let federation = await this.federationDb.findByPublicKey(publicKey);
            let user: User;
            if(!federation){
                user = await this.userDb.create({})
                federation = await this.federationDb.create({
                    public_key: publicKey,
                    user: user,
                })
            }else{
                user = federation.user
            }
            await this.transactionDB.createTransactionMember({
                amount: amountPerUser,
                transaction: transaction,
                member: user,
            })
        }))


        return{
            transaction
        }
        
        
    }

    public async getClaims(userId: number){
        const owner = await this.userDb.findById(userId)

        const claims = await this.transactionDB.getClaims(owner);
    
        return claims
    }

    public async getDepts(userId: number){
        const owner = await this.userDb.findById(userId)

        const debits = await this.transactionDB.getDepts(owner);
    
        return debits
    }

    public async submitPayment(userId: number, hash: string){
        const kuknosTransaction = await this.horizonService.getTransactionByHash(hash);
        const kuknosTransactionPayments = await this.horizonService.getTransactionPaymentByHash(hash);
        const payment = kuknosTransactionPayments[0]

        const transactionMemberId = kuknosTransaction.memo.split('_')[2]
        const transactionMember = await this.transactionDB.findTransactionMemberById(parseInt(transactionMemberId))
        if(!transactionMember){
            throw new Exception(400,'اطلاعات پرداخت نامعتبر است')
        }
        const ownerFederation = await this.federationDb.findByUser(transactionMember.transaction.owner);

        const assets = await this.kuknosService.getAssets();
        const PMNAsset = assets.filter(e => e.code === 'PMN')[0];
        const irr = PMNAsset.irr;
        
        if(payment.to != ownerFederation.public_key){
            throw new Exception(400,'اطلاعات پرداخت نامعتبر است')
        }
        
        
        let mainIrr = parseFloat(transactionMember.amount)
        let minPMN = mainIrr / (parseFloat(irr) + (parseFloat(irr) * 0.05))
        

        if(parseFloat(payment.amount) < minPMN){
            throw new Exception(400,'اطلاعات پرداخت نامعتبر است')
        }

        await this.transactionDB.setTransactionMemberHash(transactionMember.id, hash);
    }
     
}