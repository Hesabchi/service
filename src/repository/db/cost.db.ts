import { Federation } from "../../entities/federation/federation.entity";
import { getRepository } from "typeorm";
import { getConnection } from "typeorm";
import { HandleError } from '../../common/handlesErrors/handleError';
import { IcreateFederation } from "@interfaces/federation.interface";
import { User } from "../../entities/user/user.entity";
import { Cost } from "./../../entities/cost/cost.entity";
import { CostUser } from "./../../entities/costUser/costUser.entity";


export class COstDb{

    private costRepository = getRepository(Cost)
    private costUserRepository = getRepository(CostUser)

    constructor(){
        
    }




}