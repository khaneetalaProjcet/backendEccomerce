import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BahPardakht } from 'src/bah-pardakht/bah-pardakht';
import { goldInvoice, goldInvoiceInterface } from 'src/wallet/entities/goldBoxInvoice.entity';
import { wallet, walletDocument } from 'src/wallet/entities/wallet.entity';
import { walletInvoice, walletInvoiceInterface } from 'src/wallet/entities/walletInvoice.entity';

@Injectable()
export class PaymentService {

    constructor(
        @InjectModel(walletInvoice.name) private walletInvoiceModel : Model<walletInvoiceInterface>,
        @InjectModel(goldInvoice.name) private goldInvoiceModel : Model<goldInvoiceInterface>,
        @InjectModel(wallet.name) private walletModel : Model<walletDocument>,
    ){}

    private async generateInvoice (){
        let all = await this.walletInvoiceModel.countDocuments()
        let status = true
        while (status) {
            let check = await this.walletInvoiceModel.find({invoiceId : all})
            if (check.length == 0) {
                status = false
            }else{
                all = all + 1
            }
    }
    return all
}



    private async gateway (body) {
        let wallet = await this.walletModel.findOne({owner : body.user})
        let initInvoice = await this.walletInvoiceModel.create({

                amount: body.totalPrice,

                orderId: body._id,

                wallet: wallet._id,

                ivnoiceId : await this.generateInvoice(),
                
                status: "init",

                date: new Date().toLocaleString("fa-IR").split(",")[0],

                time: new Date().toLocaleString("fa-IR").split(",")[1]
        })

        const info = {
              terminalId: 7374865,
              userName: "7374865",
              userPassword: "84915185",
              orderId: +initInvoice.invoiceId,
              amount: initInvoice.amount,
              localDate: "14030310",
              localTime: "143000",
              additionalData: "",
              callBackUrl: "https://shop.khaneetala.ir/v1/mainw/redirect",
              payerId: 0,
              encPan : ''
            }; 
            
        const bpm = await BahPardakht.create();
        const responseOfBuyProcess = await bpm.bpPayRequest(info);
        
         if (responseOfBuyProcess.return.split(",")[0] == "0") {       // it means that it is success 
            initInvoice.status = "pending"
            initInvoice.authority = responseOfBuyProcess.return.split(",")[1]
            initInvoice.state = 1
            await initInvoice.save()
            return {                      // after saving data     
                message : "transfer to gateway",
                statusCode : 200,
                data : responseOfBuyProcess.return.split(",")[1]
            }
         } else {
            initInvoice.status = "failed",
                initInvoice.authority = responseOfBuyProcess.return.split(",")[1];
            await initInvoice.save()
        }
    }


    async payment(body : any){

        if (body.paymentMethod == 1){           // gateway
            return await this.gateway(body)
        } 

        if (body.paymentMethod == 2){           // gateway and goldBox

        }

        if (body.paymentMethod == 3){             // goldBox

        }

        
    }



}


