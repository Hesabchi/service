import { User } from "@entities/user/user.entity"

export interface IcreateSession{
    user : User
    jwt_secret :string
}