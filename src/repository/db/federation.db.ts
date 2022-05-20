import { Federation } from "../../entities/federation/federation.entity";
import { getRepository } from "typeorm";
import { getConnection } from "typeorm";
import { HandleError } from '../../common/handlesErrors/handleError';
import { IcreateFederation } from "@interfaces/federation.interface";


export class FederationDb{

    private federationRepository = getRepository(Federation)

    constructor(){
        
    }

    public async findById(id: number): Promise<Federation | null>{  
        return await this.federationRepository.findOne({id: id});
    }

    public async findByPersonalPublicKey(publicKey: string): Promise<Federation | null>{  
        return await this.federationRepository.findOne({personal_public_key: publicKey});
    }

    public async create(data: IcreateFederation):Promise<Federation>{
        let federation = new Federation();
        federation.personal_public_key = data.personal_public_key;
        federation.wallet_public_key = data.wallet_public_key;
        federation.user = data.user

        await federation.save()
        return federation 
    }

}