import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Interval } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { goldInvoice, goldInvoiceInterface } from 'src/wallet/entities/goldBoxInvoice.entity';



@Injectable()
export class CrobJobService {

    constructor(@InjectModel(goldInvoice.name) private goldInvoiceModel : Model<goldInvoiceInterface>){}


    @Interval('goldBox', 10000)
    async handleCronEveryMinute() {

        let pendings = await this.goldInvoiceModel.find({$and:[{ status : 'pending',
            }
            ,
            {state : 1}
        ]})

        let all = await this.goldInvoiceModel.find()
        console.log('all issss' , all)


        console.log('pendings list is>>>>>' , pendings)
    }


}
