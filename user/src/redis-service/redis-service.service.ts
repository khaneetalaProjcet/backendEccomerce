import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager'


@Injectable()
export class RedisServiceService {

    constructor(@Inject(CACHE_MANAGER) private readonly cache : Cache){}

    async get(key : string) : Promise<any>{
        const data = await this.cache.get(key)
        
        return data
    }

    async set(key : string , value : any) : Promise<any>{
        await this.cache.set(key , value)
    }

    async reset(key : string){
        await this.cache.del(key)
    }

    async setOtp(key : string , value : any) : Promise<any>{
        await this.cache.set(key , value , 120000)
    }
    
}
