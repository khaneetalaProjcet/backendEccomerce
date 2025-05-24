import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class InterserviceService {



    async createWallet(wallet:any){
       const url='http://localhost:9011/wallet'
        const body=wallet
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
            //   'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          });

          console.log("response",response);
          
          if(!response.ok){
            throw new BadRequestException("لطفا دوباره امتحان کنید");
          }
          const data = await response.json(); // <-- this gets the actual data
          return data; 
    }


     async checkExistOldUser(phoneNumber: string){
           
           const url="https://gateway.khanetala.ir/v1/query/internal/checkUser"
           const body={
            phoneNumber
           }
           const token=await this.getToken()

           console.log("token",token.token);
           
           if(!token){
            throw new BadRequestException("لطفا دوباره امتحان کنید");
           }
           const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token.token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          });

          // if(!response.ok){
          //   throw new BadRequestException("لطفا دوباره امتحان کنید");
          // }
          const data = await response.json(); // <-- this gets the actual data
          console.log("data",data);
          
          return data; 

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
