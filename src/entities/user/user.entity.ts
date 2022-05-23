import {BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm'
import {IsEmail, IsNotEmpty } from 'class-validator'
import { Federation } from './../../entities/federation/federation.entity'


@Entity()
export class User extends BaseEntity{
    @PrimaryGeneratedColumn('increment') 
    id: number

    @Column({nullable: true})
    first_name: string

    @Column({nullable: true})
    last_name: string

    @Column({nullable: true})
    email: string

    @Column({nullable: true })
    phone_number: string
    
    @Column({nullable: false , type: 'boolean' , default: false})
    email_verified: boolean

    @Column({nullable: false , type: 'boolean' , default: false})
    phone_number_verified: boolean

    @Column('timestamp with time zone', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })  
    created_at: Date;

    @Column({nullable: false , type: 'boolean' , default: true})
    active: boolean

    @OneToOne(()=> Federation, (federation)=>{federation.user})
    federation: Federation
} 