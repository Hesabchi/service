import { Transaction } from "../../entities/transaction/transaction.entity";
import { User } from "../../entities/user/user.entity"

export interface IcreateTransaction{
    owner : User
    title: string
    amount: string
}

export interface IcreateTransactionMember{
    member: User,
    transaction: Transaction,
    amount: string
}