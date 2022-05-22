import { Federation } from "../../entities/federation/federation.entity";
import { getRepository } from "typeorm";
import { getConnection } from "typeorm";
import { HandleError } from '../../common/handlesErrors/handleError';
import { User } from "../../entities/user/user.entity";
import { Transaction } from "../../entities/transaction/transaction.entity";
import { TransactionMember } from "../../entities/transactionMember/transactionMember.entity";
import { IcreateTransaction, IcreateTransactionMember } from "../../common/interfaces/transaction.interface";
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

    public async getClaims(owner: User):Promise<TransactionMember[]>{
        const claims = await this.transactionMemberRepository.createQueryBuilder('transaction_member')
            .innerJoin('transaction_member.transaction', 'transaction')
            .where('transaction.owner = :owner', {owner: owner})
            .where('transaction_member.hash = :hash', {hash: ""})
            .getMany()
        return claims
    }


}