import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn  ,OneToOne , JoinColumn} from 'typeorm'
import { User } from '../user/user.entity'


@Entity()
export class Federation extends BaseEntity{

    @PrimaryGeneratedColumn('increment') 
    id: number

    @OneToOne(() => User)
    @JoinColumn()
    user: User

    @Column({nullable : false})
    personal_public_key : string

    @Column({nullable : true})
    wallet_public_key : string

    @Column('timestamp with time zone', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })  
    created_at: Date;
} 