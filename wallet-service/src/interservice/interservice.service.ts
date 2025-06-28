import { Body, Injectable } from '@nestjs/common';

import fetch from 'node-fetch'


@Injectable()
export class InterserviceService {

    /**
     * this module is for get order from product service
     * @param id 
     * @returns 
     */
    async getOrder(id: string) {
        try {
            let rawResponse = await fetch(`http://localhost:9014/order/internal/findone/${id}`, {
                method: 'GET',
            })
            console.log('requests results from product >>>>', rawResponse)
            if (!rawResponse) {
                return 0                       // no connection exist
            }
            let response = rawResponse.json()

            console.log(response);



            console.log("respo");
            
            
            return response.data.order
            

            // if (!response) {
            //     return 0                      // no connection exist
            // }
            // if (response.status==200) {
            //     return response.data
            // } else if (response.message == "notFound") {
            //     return "orderNotFound"
            // } else if (response.message == "internalError") {
            //     return "productError"
            // } else {
            //     return "unknown"
            // }
        } catch (error) {
            console.log('error occured in getting order >>>> ', error)
            return 0
        }
    }


    /**
     * this module is for update order after completing order
     * @param orderId 
     * @param invoice 
     * @param status 
     * @returns 
     */
    async updateorder(orderId: string, invoice: any, status: number) {
        try {
            let rawResponse = await fetch(`http://localhost:9014/order/internal/update/${orderId}/${status}`,
                {
                    method: 'POST',
                    body: JSON.stringify(invoice)
                }
            )
            let response = await rawResponse.json()
            if (!response) {
                return { success: false }
            }
            return {
                response
            }
        } catch (error) {
            console.log('error occured in updating order >>>> ', error)
            return { success: false }
        }
    }


    /**
     * this module is for update khanetala goldBox of user after completing behPardakht gateway
     * @param invoice 
     * @returns 
     */
    async updateGoldBox(invoice: any) {
        try {
            let rawResponse = await fetch('https://gateway.khanetala.ir/v1/trade/internal/goldBox/update',
                {
                    method: 'POST',
                    body: JSON.stringify(invoice.toObject())
                },
            )

            let response = await rawResponse.json()

            if (!response) {
                return { success: false }
            }
            return response
        } catch (error) {
            console.log('error occured while trying to update goldBox in khanetala')
            return { success: false }
        }
    }
}
