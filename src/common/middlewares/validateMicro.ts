import { Exception, HandleError } from '../../common/handlesErrors/handleError';
import {Request , Response ,  NextFunction } from 'express';

export function validateMicro(req : Request , res : Response , next:NextFunction){
    try {
        
        
        next();
    } catch (err) {
        if(err instanceof Exception){
            HandleError(res, err)
        }else{
            let error = new Exception(401, 'شما دسترسی لازم برای انجام این عملیات را ندارید');
            HandleError(res, error)
        }
    }  
}


