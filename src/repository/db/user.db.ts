import { User } from "../../entities/user/user.entity";
import { getRepository } from "typeorm";
import { HandleError  , Exception} from '../../common/handlesErrors/handleError';
import {IcreateUser} from '../../common/interfaces/user.interface'

export class UserDb{

    private userRepository = getRepository(User) 
    
    constructor(){
     
    }


    // create user
    public async create(data : IcreateUser) : Promise<User>{
      try {
        let user = new User()
        user.first_name = data.first_name
        user.last_name = data.last_name
        user.email = data.email 
        user.email_verified = false 
        user.phone_number = data.phone_number
        user.phone_number_verified = false;
        user.active = true;
        user.created_at = new Date()
        
        await user.save();
        return user

      } catch (error) {
         throw error.message
      }
     
    }

    public async findById(userId: number): Promise<User | null>{
        let user:User = await this.userRepository.findOne({id: userId});
        return user
    }

}