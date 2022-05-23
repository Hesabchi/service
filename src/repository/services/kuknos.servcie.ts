import { Exception } from '../../common/handlesErrors/handleError'
import  axios, {AxiosInstance} from 'axios'

//const StellarSDK = require('stellar-sdk')

export class KuknosService{

    private api:AxiosInstance

    constructor(){
        this.api =  axios.create({
            baseURL: process.env.KUKNOS_URL,
        })
    }

    public async getAssets():Promise<any>{
        try {
            const res = await this.api.get(`/microservice/asset/directory`).then(result => result.data.data)
            return res;
        } catch (error) {            
            throw error
        }

    }
}