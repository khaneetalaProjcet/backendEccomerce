import { Injectable } from '@nestjs/common';

@Injectable()
export class InterserviceService {


     async checkExistOldUser(phoneNumber: string){
           const url="https://gateway.khanetala.ir/v1/query/internal/checkUser"
           const body={
            phoneNumber
           }
           const token=await this.getToken()

           console.log("token",token);
           
           if(!token){
            return ;
           }
           const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          });

          if(!response.ok){
            return ;
          }
          const data = await response.json(); // <-- this gets the actual data
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
            return ;
          }
          const data = await response.json(); // <-- this gets the actual data
          return data; 
    }
}
