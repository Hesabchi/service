import { TransactionMember } from './../../entities/transactionMember/transactionMember.entity'
import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../user/user.entity'


@Entity()
export class Transaction extends BaseEntity{
    @PrimaryGeneratedColumn('increment') 
    id: number

    @ManyToOne(() => User)
    owner: User   

    @Column({nullable: false})
    title: string 

    @Column({nullable: false})
    amount: string 

    @Column('timestamp with time zone', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })  
    created_at: Date;
} 