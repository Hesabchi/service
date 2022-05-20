import { User } from "@entities/user/user.entity"

export interface IcreateFederation{
    user : User
    personal_public_key: string
    wallet_public_key?: string
}