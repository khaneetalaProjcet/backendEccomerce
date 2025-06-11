import { Injectable } from '@nestjs/common';
import { htmlPage } from './bah-pardakht/bah-pardakht';
import { InjectModel } from '@nestjs/mongoose';
import { walletInvoice, walletInvoiceInterface } from './wallet/entities/walletInvoice.entity';
import { Model } from 'mongoose';
import { goldInvoice } from './wallet/entities/goldBoxInvoice.entity';
import { InterserviceService } from './interservice/interservice.service';

@Injectable()
export class AppService {

  private htmlPageService = new htmlPage()

  constructor(@InjectModel(walletInvoice.name) private walletInvoiceModel : Model<walletInvoiceInterface>,
  private interservice : InterserviceService
){
    
  }


  getHello(): string {
    return 'Hello World!';
  }


  async redirectFromBehPardakht(body) {
    console.log('body from behpardakht', body)

    if (body.RefId) {
      let invoice = await this.walletInvoiceModel.findOne({ authority: body.RefId })
      invoice.paymentDetail = body;

      await invoice.save()
      
      if (body.ResCode == "0") {
        invoice.status == "completed"
        let productResponse = await this.interservice.updateorder(invoice._id.toString() , invoice , 1)
        if (productResponse && productResponse.statusCode == 1){          // success
          invoice.state = 3
        }else{
          invoice.state = 2
        }
        await invoice.save()
      } else if (body.ResCode == "17") {
        invoice.status = 'failed'
        let productResponse = await this.interservice.updateorder(invoice._id.toString() , invoice , 0)
        if (productResponse && productResponse.statusCode == 1){          // success
          invoice.state = 3
        }else{
          invoice.state = 2
        }
        await invoice.save()
        return {
          message: 'پرداخ  ت نا موفق',
          statusCode: 301,
          data: await this.htmlPageService.failedPage("https://web.khaneetala.ir", "انصراف از درخواست")
        }
      } else {
        invoice.status = 'failed'
        let productResponse = await this.interservice.updateorder(invoice._id.toString() , invoice , 0)
        if (productResponse && productResponse.statusCode == 1){          // success
          invoice.state = 3
        }else{
          invoice.state = 2
        }
        return {
          message: 'پرداخت نا موفق',
          statusCode: 301,
          data: await this.htmlPageService.failedPage("https://web.khaneetala.ir", "تراکنش نا موفق،در صورت کسر وجه مبلغ تا چند ساعت آینده به حساب شما واریز میگردد")
        }
      }


    }else{
      return {
        message : 'پرداخت نا موفق',
        statusCode : 301,
        data : await this.htmlPageService.successPage("https://web.khaneetala.ir/")
      }
    }

  }


}
