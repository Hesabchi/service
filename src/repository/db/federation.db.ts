import { Federation } from "../../entities/federation/federation.entity";
import { getRepository } from "typeorm";
import { getConnection } from "typeorm";
import { HandleError } from '../../common/handlesErrors/handleError';
import { IcreateFederation } from "../../common/interfaces/federation.interface";
import { User } from "../../entities/user/user.entity";


export class FederationDb{

    private federationRepository = getRepository(Federation)

    constructor(){
        
    }

    public async findById(id: number): Promise<Federation | null>{  
        return await this.federationRepository.findOne({id: id});
    }

    public async findByPublicKey(publicKey: string): Promise<Federation | null>{  
        return await this.federationRepository.findOne({public_key: publicKey}, {relations: ['user']});
    }

    public async create(data: IcreateFederation):Promise<Federation>{
        let federation = new Federation();
        federation.public_key = data.public_key;
        federation.user = data.user

        await federation.save()
        return federation 
    }


}