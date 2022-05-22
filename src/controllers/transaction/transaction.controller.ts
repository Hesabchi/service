import {Router, Request, Response} from 'express'
import { IResponse } from 'common/interfaces/response.interface';
import { HandleError , Exception } from '../../common/handlesErrors/handleError'
import { apiLimiter } from '../../common/middlewares/rateLimit';
import { UserUseCase } from '../../use-cases/user.usecase';
import { getChallengeDTO, loginDTO } from '../dto/user.dto';
import { newCostDTO } from '../dto/cost.dto';
import { verifyUser } from '../../common/middlewares/jwt';
import { CostUseCase } from '../../use-cases/transaction.usecase';

export default class TransactionController{
    public path: String = "/transactions";
	public router = Router();

    private userUseCase: UserUseCase
    private costUseCase: CostUseCase


    constructor(){
        this.initalRoute()
        this.userUseCase = new UserUseCase()
        this.costUseCase = new CostUseCase()
    }


    private initalRoute(){
        this.router.post('/', apiLimiter , verifyUser,   (req, res) => this.newCost(req, res))
        this.router.get('/claims', apiLimiter , verifyUser,   (req, res) => this.getClaims(req, res))
    }

    public async newCost(req: Request, res: Response){
        try{
            let data = new newCostDTO(req.body)            
            await data.validate();

            const userId = parseInt(req.headers["user-id"] as string);
            
            const newCost = await this.costUseCase.newCost(userId, data);
            
            const response: IResponse = {
                success: true,
                message: '',
                data: {
                    cost: newCost.transaction
                }
            }
            res.status(200).json(response)

        }catch(err){
            HandleError(res, err)
        }
    }


    public async getClaims(req: Request, res: Response){
        try{
            const userId = parseInt(req.headers["user-id"] as string);
            const claims = await this.costUseCase.getClaims(userId);
            
            const response: IResponse = {
                success: true,
                message: '',
                data: {
                    claims
                }
            }
            res.status(200).json(response)

        }catch(err){
            HandleError(res, err)
        }
    }






}