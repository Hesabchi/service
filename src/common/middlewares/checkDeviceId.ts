import {Request , Response ,  NextFunction } from 'express';
import { Exception, HandleError } from '../handlesErrors/handleError';

export function checkDeviceId(req : Request , res : Response , next:NextFunction){
    try {
        const platformVersion = req.headers['platform-version'];
        if(!platformVersion){
            throw new Exception(400, 'سربرگ Platform-Version وجود ندارد')
        }
        next();
    } catch (error) {
        HandleError(res, error)
    }
}