import { Injectable } from '@nestjs/common';

import fetch from 'node-fetch'


@Injectable()
export class InterserviceService {


    async getOrder(id : string){
        let rawResponse = await fetch(`https://localhost:9014/order/internal/findone/${id}` , {
            method : 'GET',
        })

        console.log('requests results from product >>>> ' , rawResponse)

        if (!rawResponse){
            return 0                       // no connection exist
        }
        let response = rawResponse.Json()

        if (!response){
            return 0                      // no connection exist
        }

        if (response.success){
            return response.data
        }else if(response.code == 2){
            return "orderNotFound"
        }else if(response.code == 3){
            return ""
        }
}


    async updateorder(orderId : string , invoice : any , status : number){
        
return {
    statusCode : 2
}

    }

}
