import { User } from "./../../entities/user/user.entity"

export interface IcreateFederation{
    user : User
    public_key: string
}