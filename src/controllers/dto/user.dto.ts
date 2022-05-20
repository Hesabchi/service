import { IResponse } from '@interfaces/response.interface';
import {IsNotEmpty  , validate, IsEmail} from 'class-validator'
import {Exception} from '../../common/handlesErrors/handleError'


export class getChallengeDTO{
    constructor(data:any){
        this.public_key = data.public_key;
    }

    @IsNotEmpty({message: 'کلید عمومی نباید خالی باشد'})
    public_key: string;

    public async validate(){
        let errors = await validate(this);            
        if(errors.length > 0){
            throw new Exception(400 , errors[0].constraints[Object.keys(errors[0].constraints)[0]])
        }
    }
}

export class loginDTO{
    constructor(data:any){
        this.public_key = data.public_key;
        this.signature = data.signature;
    }

    @IsNotEmpty({message: 'کلید عمومی نباید خالی باشد'})
    public_key: string;

    @IsNotEmpty({message: 'امضا نباید خالی باشد'})
    signature: string;

    public async validate(){
        let errors = await validate(this);            
        if(errors.length > 0){
            throw new Exception(400 , errors[0].constraints[Object.keys(errors[0].constraints)[0]])
        }
    }
}