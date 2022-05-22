import { IResponse } from '../../common/interfaces/response.interface';
import {IsNotEmpty  , validate, IsEmail} from 'class-validator'
import {Exception} from '../../common/handlesErrors/handleError'


export class newCostDTO{
    constructor(data:any){
        this.title = data.title;
        this.amount = data.amount;
        this.include_me = data.include_me;
        this.users = data.users;
    }

    @IsNotEmpty({message: 'عنوان نباید خالی باشد'})
    title: string;

    @IsNotEmpty({message: 'مقدار نباید خالی باشد'})
    amount: string;

    include_me: boolean;

    users: string[];

    public async validate(){
        let errors = await validate(this);            
        if(errors.length > 0){
            throw new Exception(400 , errors[0].constraints[Object.keys(errors[0].constraints)[0]])
        }
    }
}

