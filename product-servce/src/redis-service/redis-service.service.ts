import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager'


@Injectable()
export class RedisServiceService {

    constructor(@Inject(CACHE_MANAGER) private readonly cache : Cache){}

    async getter(key : string) : Promise<any>{
        const data = await this.cache.get(key)
        return data
    }

    async setter(key : string , value : any , ttl:number ) : Promise<any>{
        await this.cache.set(key , value ,ttl)
    }

    async reset(key : string){
        await this.cache.del(key)
    }

    async setOtp(key : string , value : any) : Promise<any>{
        await this.cache.set(key , value , 120000)
    }
    
    // async del(){}
}
