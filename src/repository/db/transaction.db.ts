import { Federation } from "../../entities/federation/federation.entity";
import { getRepository } from "typeorm";
import { getConnection } from "typeorm";
import { HandleError } from '../../common/handlesErrors/handleError';
import { User } from "../../entities/user/user.entity";
import { Transaction } from "../../entities/transaction/transaction.entity";
import { TransactionMember } from "../../entities/transactionMember/transactionMember.entity";
import { Iclaim, IcreateTransaction, IcreateTransactionMember, Idepts } from "../../common/interfaces/transaction.interface";
import { db } from "./../../server";


export class TransactionDb{

    private transactionRepository = getRepository(Transaction)
    private transactionMemberRepository = getRepository(TransactionMember)

    constructor(){
        
    }


    public async createTransaction(data: IcreateTransaction):Promise<Transaction>{
        const transaction = new Transaction();
        transaction.amount = data.amount;
        transaction.owner = data.owner;
        transaction.title = data.title;
        transaction.created_at = new Date();

        await transaction.save();
        return transaction;
    }

    public async createTransactionMember(data: IcreateTransactionMember):Promise<TransactionMember>{
        const transactionMember = new TransactionMember();
        transactionMember.amount = data.amount;
        transactionMember.member = data.member;
        transactionMember.transaction = data.transaction;
        transactionMember.hash = '';

        await transactionMember.save();
        return transactionMember;
    }

    public async findTransactionMemberById(id: number): Promise<TransactionMember | null>{  
        return await this.transactionMemberRepository.findOne({id: id}, {relations: ['transaction', 'transaction.owner']});
    }

    public async findTransactionById(id: number): Promise<Transaction | null>{  
        return await this.transactionRepository.findOne({id: id});
    }

    public async setTransactionMemberHash(id: number, hash: string): Promise<void>{  
        await this.transactionMemberRepository.update({id: id}, {hash: hash});
    }


    public async getClaims(owner: User):Promise<Iclaim[]>{
        const claims = await getConnection().createQueryBuilder()
                            .select('transaction_member')
                            .from(TransactionMember , 'transaction_member')
                            .innerJoinAndSelect('transaction', 'transaction' , 'transaction_member.transactionId = transaction.id')
                            .where('transaction.ownerId = :ownerId', {ownerId: owner.id})
                            .andWhere('transaction_member.hash = :hash', {hash: ""})
                            .innerJoinAndSelect('federation', 'federation', 'transaction_member.member = federation.userId')
                            .select([
                                'transaction_member.amount as amount',
                                'transaction.created_at as created_at',
                                'transaction.title as title',
                                'federation.public_key as publickey'
                            ])
                            .getRawMany()                            
        return claims;
    }

    public async getDepts(member: User):Promise<Idepts[]>{
        const depts = await getConnection().createQueryBuilder()
                            .select('transaction_member')
                            .from(TransactionMember , 'transaction_member')
                            .innerJoinAndSelect('transaction', 'transaction' , 'transaction_member.transactionId = transaction.id')
                            .where('transaction_member.memberId = :memberId', {memberId: member.id})
                            .andWhere('transaction_member.hash = :hash', {hash: ""})
                            .innerJoinAndSelect('federation', 'federation', 'transaction.ownerId = federation.userId')
                            .select([
                                'transaction_member.amount as amount',
                                'transaction.created_at as created_at',
                                'transaction.title as title',
                                'federation.public_key as publickey',
                                'transaction_member.id as id'
                            ])
                            .getRawMany()                            
        return depts;
    }


}