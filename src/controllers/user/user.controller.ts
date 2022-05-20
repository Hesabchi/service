import {Router, Request, Response} from 'express'
import { IResponse } from 'common/interfaces/response.interface';
import { HandleError , Exception } from '../../common/handlesErrors/handleError'
import { apiLimiter } from '../../common/middlewares/rateLimit';
import { UserUseCase } from '../../use-cases/user.usecase';
import { getChallengeDTO, loginDTO } from '../dto/user.dto';

export default class UserController{
    public path: String = "/user";
	public router = Router();

    private userUseCase: UserUseCase


    constructor(){
        this.initalRoute()
        this.userUseCase = new UserUseCase()
    }


    private initalRoute(){
        this.router.get('/challenge', apiLimiter ,  (req, res) => this.getChallenge(req, res))
        this.router.post('/login', apiLimiter ,  (req, res) => this.login(req, res))
    }

    public async getChallenge(req: Request, res: Response){
        try{
            let data = new getChallengeDTO(req.body)
            data.validate();

            const challenge = await this.userUseCase.getChallenge(data.publickey);
            const response: IResponse = {
                success: true,
                message: '',
                data: {
                    challenge: challenge
                }
            }
            res.status(200).json(response)

        }catch(err){
            HandleError(res, err)
        }
    }

    public async login(req: Request, res: Response){
        try{
            let data = new loginDTO(req.body)
            data.validate();

            const loginRes = await this.userUseCase.login(data.publickey, data.signature)
            const response: IResponse = {
                success: true,
                message: '',
                data: {
                    access_tone: loginRes.accessToken,
                    wallet_public_key: loginRes.walletPublicKey
                }
            }
            res.status(200).json(response)
            
        }catch(err){
            HandleError(res, err)
        }
    }

}