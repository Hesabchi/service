import {Router, Request, Response} from 'express'
import { IResponse } from 'common/interfaces/response.interface';
import { HandleError , Exception } from '../../common/handlesErrors/handleError'
import { apiLimiter } from '../../common/middlewares/rateLimit';
import { UserUseCase } from '../../use-cases/user.usecase';
import { getChallengeDTO, loginDTO } from '../dto/user.dto';
import { newPaymentDTO, newTransactionDTO } from '../dto/transaction.dto';
import { verifyUser } from '../../common/middlewares/jwt';
import { TransactionUseCase } from '../../use-cases/transaction.usecase';

export default class TransactionController{
    public path: String = "/transactions";
	public router = Router();

    private userUseCase: UserUseCase
    private transactionUseCase: TransactionUseCase


    constructor(){
        this.initalRoute()
        this.userUseCase = new UserUseCase()
        this.transactionUseCase = new TransactionUseCase()
    }


    private initalRoute(){
        this.router.post('/', apiLimiter , verifyUser,   (req, res) => this.newCost(req, res))
        this.router.get('/claims', apiLimiter , verifyUser,   (req, res) => this.getClaims(req, res))
        this.router.get('/depts', apiLimiter , verifyUser,   (req, res) => this.getDepts(req, res))
        this.router.post('/payment', apiLimiter , verifyUser,   (req, res) => this.submitpayment(req, res))
    }

    public async newCost(req: Request, res: Response){
        try{
            let data = new newTransactionDTO(req.body)            
            await data.validate();

            const userId = parseInt(req.headers["user-id"] as string);
            
            const newCost = await this.transactionUseCase.newCost(userId, data);
            
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
            const claims = await this.transactionUseCase.getClaims(userId);
            
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

    public async getDepts(req: Request, res: Response){
        try{
            const userId = parseInt(req.headers["user-id"] as string);
            const depts = await this.transactionUseCase.getDepts(userId);
            
            const response: IResponse = {
                success: true,
                message: '',
                data: {
                    depts
                }
            }
            res.status(200).json(response)

        }catch(err){
            HandleError(res, err)
        }
    }

    public async submitpayment(req: Request, res: Response){
        try{
            const userId = parseInt(req.headers["user-id"] as string);
            const data = new newPaymentDTO(req.body);
            await data.validate()

            await this.transactionUseCase.submitPayment(userId, data.hash);
            
            const response: IResponse = {
                success: true,
                message: '',
                data: null
            }
            res.status(200).json(response)

        }catch(err){
            console.log(err);
            
            HandleError(res, err)
        }
    }






}