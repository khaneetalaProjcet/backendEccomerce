import {RedisServiceService} from "../redis-service/redis-service.service"


export class LockerService {
 constructor(private redisService:RedisServiceService){}
     async check(id) {
        let a = await this.redisService.getter(`lock-${id}`)
        if (!a) {
            await this.redisService.setter(`lock-${id}` , "1" , 5000)
            console.log(`document ${id} locked`)
            return false;
        }
        if (+a == 1) {
            return true
        } else {
            await this.redisService.setter(`lock-${id}` , "1" , 5000)
            console.log(`document ${id} locked`)
            return false
        }
    }

    /**
     * its for locking user for creating transActions
     * @param id 
     * @param ttl 
     * @returns 
     */
    async createTransAction(id) {
        let a = await this.redisService.getter(`transActions::create::${id}`)
        if (!a) {
            await this.redisService.setter(`lock-${id}` , "1" , 500)
            console.log(`document ${id} locked`)
            return false;
        }
        if (+a == 1) {
            return true
        } else {
            await this.redisService.setter(`lock-${id}` , "1" , 500)
            console.log(`document ${id} locked`)
            return false
        }
    }

    async disablor(id){
        await this.redisService.deleter(`lock-${id}`)
        console.log(`${id} unLocked`)
        return true
    } 


     async justCheck(id) {
        let a = await this.redisService.getter(`lock-${id}`)
        if (!a) {
            console.log(`data ${id} is not locked`)
            return false;
        }
        if (+a == 1) {
            return true
        } else {
            // await this.redisService.setter(lock-${id} , 1)
            console.log(`data ${id} is not locked`)
            return false
        }
    }
     
}