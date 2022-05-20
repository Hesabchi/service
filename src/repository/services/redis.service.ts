import * as redis from 'redis'


export class RedisService{
    private redisClient;


    constructor(){
        // set up redis database config
        (async () =>{
            const host:string = process.env.REDIS_HOST
            const port:number = parseInt(process.env.REDIS_PORT)
    
            this.redisClient = redis.createClient({
                url: `redis://${host}:${port}`
            })
    
            await this.redisClient.connect();
        })()
    }

    // this function set given key ,value and expire time in the redis database
    public async set(key: string, value: string, ex:number = 120){
        await this.redisClient.set(key, value, {
            EX: ex
        })
    }

    // this function retrieve value from given key
    public async get(key: string){
        return await this.redisClient.get(key)
    }

    public async delete(key: string){
        await this.redisClient.del(key)
    }
}