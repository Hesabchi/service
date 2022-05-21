import { Exception } from '../../common/handlesErrors/handleError'
import  axios, {AxiosInstance} from 'axios'
import * as StellarSDK from 'stellar-sdk'

//const StellarSDK = require('stellar-sdk')

export class HorizonService{

    private api:AxiosInstance

    constructor(){
        this.api =  axios.create({
            baseURL: process.env.HORIZON_URL,
        })
    }

    public async getAccount(publicKey: string):Promise<StellarSDK.ServerApi.AccountRecord>{
        try {
            const res = await this.api.get(`/accounts/${publicKey}`).then(result => result.data)
            return res;
        } catch (error) {            
            throw new Exception(400, 'حساب ققنوسی شما در شبکه ققنوس یافت نشد')
        }

    }
}