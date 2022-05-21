import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../user/user.entity'


@Entity()
export class Cost extends BaseEntity{
    @PrimaryGeneratedColumn('increment') 
    id: number

    @ManyToOne(() => User)
    owner: User   

    @Column({nullable: false})
    title: string 

    @Column({nullable: false})
    amount: number 

    @Column('timestamp with time zone', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })  
    created_at: Date;
} 