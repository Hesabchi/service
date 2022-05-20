import { User } from "../../entities/user/user.entity";
import { Session } from "../../entities/session/session.entity";
import { getRepository } from "typeorm";
import { getConnection } from "typeorm";
import { HandleError } from '../../common/handlesErrors/handleError';
import { IcreateSession } from "@interfaces/session.interafce";


export class SessionDb{

    private sessionRepository = getRepository(Session)

    constructor(){
        
    }

    public async findById(id: number): Promise<Session | null>{  
        return await this.sessionRepository.findOne({id: id});
    }

    public async findByUser(user: User): Promise<Session | null>{  
        return await this.sessionRepository.findOne({user: user});
    }

    public async create(data: IcreateSession):Promise<Session>{
        let session = new Session();
        session.jwt_secret = data.jwt_secret
        session.user = data.user
        session.created_at = new Date()

        await session.save()
        return session
    }

    public async delete(id: number){
        await this.sessionRepository.delete({id: id})
    }

}