
import {Request, Response, NextFunction} from 'express'
import { Exception, HandleError } from './../handlesErrors/handleError'
import * as jsonWebToken from 'jsonwebtoken';
import { SessionDb } from './../../repository/db/session.db';
import { Session } from './../../entities/session/session.entity';
import { IJWTPayload } from './../interfaces/jwt.interface';


export async function verifyUser(req: Request, res: Response, next: NextFunction){
    const sessionDb = new SessionDb()

    try {
        let token = req.headers['authorization']
        if(!token){
            throw new Exception(401, 'شما دسترسی لازم برای انجام این عملیات را ندارید');
        }

        let tokenPayload:IJWTPayload = jsonWebToken.decode(token) as IJWTPayload;
        
        let session = await sessionDb.findById(tokenPayload.session_id);
        if(!session){
            throw new Exception(401, 'شما دسترسی لازم برای انجام این عملیات را ندارید');
        }

        jsonWebToken.verify(token , session.jwt_secret);                
        req.headers['user-id'] = tokenPayload.user_id.toString() 

        next()
    } catch (err) {
        if(err instanceof Exception){
            HandleError(res, err)
        }else{
            let error = new Exception(401, 'شما دسترسی لازم برای انجام این عملیات را ندارید');
            HandleError(res, error)
        }
    }

}