import { RedisService } from '../repository/services/redis.service'
import{ UserDb } from '../repository/db/user.db'
import{ SessionDb } from '../repository/db/session.db'
import{ FederationDb } from '../repository/db/federation.db'
import * as randomSentence from 'random-sentence'
import { Exception } from '@handlesErrors/handleError'
import { User } from '@entities/user/user.entity'
import * as crypto from 'crypto';
import * as jsonWebToken from 'jsonwebtoken';
import { IJWTPayload } from '@interfaces/jwt.interface'


const StellarSdk = require('stellar-sdk')

export class UserUseCase{

   
    private userDb:UserDb
    private sessionDb:SessionDb
    private federationDb:FederationDb
    private redisService:RedisService

    constructor(){
        this.userDb = new UserDb()
        this.sessionDb = new SessionDb()
        this.federationDb = new FederationDb()
        this.redisService = new RedisService()
    }

    public async getChallenge(publicKey: string):Promise<string>{
        try {        
            let sentence = randomSentence({min: 15, max: 20})            
            await this.redisService.set(`challenge_${publicKey}`, sentence, 3600)
            return sentence
        } catch (error) {
            throw error
        }
     
    }

    public async login(publicKey: string, signature: string):Promise<any>{
        try {        
            let challenge = await this.redisService.get(publicKey);            
            let keypair = StellarSdk.Keypair.fromPublicKey(publicKey)
            let sigResult = StellarSdk.verify(Buffer.from(challenge, 'utf-8'), Buffer.from(signature, 'base64'), keypair.rawPublicKey())
            if(!sigResult){
                throw new Exception(400, 'امضا صحیح نمی باشد')
            }

            let federation = await this.federationDb.findByPersonalPublicKey(publicKey);
            let user: User;
            if(!federation){
                user = await this.userDb.create({})
                federation = await this.federationDb.create({
                    personal_public_key: publicKey,
                    user: user,
                })
            }

            const tokenSecret = crypto.randomBytes(64).toString('hex')

            let session = await this.sessionDb.findByUser(user);

            if(session){
                await this.sessionDb.delete(session.id);
            }

            session = await this.sessionDb.create({
                jwt_secret: tokenSecret,
                user: user
            });

            const jwtPayload:IJWTPayload = {
                session_id: session.id,
                user_id: user.id
            }
            let accessToken = jsonWebToken.sign(jwtPayload, tokenSecret);

            return {
                accessToken: accessToken,
                walletPublicKey: federation.wallet_public_key
            };

        } catch (error) {
           throw error
        }
       
      }

}