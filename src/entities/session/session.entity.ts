import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../user/user.entity'


@Entity()
export class Session extends BaseEntity{
    @PrimaryGeneratedColumn('increment') 
    id: number

    @ManyToOne(() => User)
    user: User   

    @Column({nullable: false})
    jwt_secret: string 

    @Column('timestamp with time zone', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })  
    created_at: Date;
} 