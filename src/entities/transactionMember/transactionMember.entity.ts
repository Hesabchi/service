import { Transaction } from '../transaction/transaction.entity'
import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../user/user.entity'


@Entity()
export class TransactionMember extends BaseEntity{
    @PrimaryGeneratedColumn('increment') 
    id: number

    @ManyToOne(() => User)
    member: User   

    @ManyToOne(() => Transaction)
    transaction: Transaction

    @Column({nullable: false})
    hash: string 

    @Column({nullable: false})
    amount: string 
} 