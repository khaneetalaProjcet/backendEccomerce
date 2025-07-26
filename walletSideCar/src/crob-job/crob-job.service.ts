import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Interval } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { InterserviceService } from 'src/interservice/interservice.service';
import { goldInvoice, goldInvoiceInterface } from 'src/wallet/entities/goldBoxInvoice.entity';



@Injectable()
export class CrobJobService {

    constructor(@InjectModel(goldInvoice.name) private goldInvoiceModel: Model<goldInvoiceInterface>
        , private interService: InterserviceService,
    ) { }

    @Interval('goldBox', 10000)
    async handleCronEveryMinute() {

        let pendings = await this.goldInvoiceModel.find({
            $and: [{
                status: 'pending',
            }
                ,
            { state: 1 }
            ]
        })

        console.log('pendings list is>>>>>', pendings)
        // here we should req to goldBox for update the wallet 
        let updatorGoldBoxResponse = await this.interService.updateGoldBox(pendings[0])
        // and then req to order and submit the order payment
        
        // 


    }
}
