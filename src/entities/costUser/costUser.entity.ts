import { Cost } from './../cost/cost.entity'
import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../user/user.entity'


@Entity()
export class CostUser extends BaseEntity{
    @PrimaryGeneratedColumn('increment') 
    id: number

    @ManyToOne(() => User)
    user: User   

    @ManyToOne(() => Cost)
    cost: Cost

    @Column({nullable: false})
    hash: string 

    @Column({nullable: false})
    amount: number 
} 