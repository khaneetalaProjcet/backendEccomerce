import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RedisServiceService } from 'src/redis-service/redis-service.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
@Injectable()
export class goldPriceService{

     constructor(private redisService: RedisServiceService ,
  ) {}

    async getGoldPrice(){
        const cacheGoldPrice=await this.redisService.getGoldPrice()
        console.log("inFirst",cacheGoldPrice);
        if(cacheGoldPrice){
            console.log("in condition",cacheGoldPrice);
            
            return cacheGoldPrice
        }
        else {
            const goldPrice=await this.getGoldPriceFromManinService()
            console.log(goldPrice);
            await this.redisService.setGoldPrice(goldPrice)
            return goldPrice
        }
    }

    private async getGoldPriceFromManinService(){



         


           const url="https://gateway.khanetala.ir/v1/query/internal/goldPrice"
           const token=await this.getToken()
           console.log("token",token.token);
           if(!token){
            throw new BadRequestException("لطفا دوباره امتحان کنید");
           }
           const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token.token}`,
              'Content-Type': 'application/json',
            },
          });

          // if(!response.ok){
          //   throw new BadRequestException("لطفا دوباره امتحان کنید");
          // }

          console.log(response);
          

          const data = await response.json(); // <-- this gets the actual data
         
          if(!data){
            return "unkown"
          }

          console.log("data in request");
          
          console.log("data",data);
          

          return data.data.buyPrice; 
    }

    private async getToken(){
        const url='https://gateway.khanetala.ir/v1/query/internal/getToken'
        const body={
            userName:"",
            password:""
        }
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
            //   'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          });

          if(!response.ok){

            throw new BadRequestException("لطفا دوباره امتحان کنید");
          }
          const data = await response.json(); // <-- this gets the actual data
          return data; 
    }
    
}
