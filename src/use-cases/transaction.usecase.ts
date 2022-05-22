import { UserDb } from "../repository/db/user.db";
import { newCostDTO } from "../controllers/dto/cost.dto";
import { FederationDb } from "../repository/db/federation.db";
import { User } from "../entities/user/user.entity";
import { TransactionDb } from "../repository/db/transaction.db";


export class CostUseCase{
    
    private userDb: UserDb
    private federationDb: FederationDb
    private transactionDB: TransactionDb

    constructor(){
        this.userDb = new UserDb();
        this.federationDb = new FederationDb()
        this.transactionDB = new TransactionDb()
    }

    public async newCost(userId: number, data: newCostDTO){

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
     
}