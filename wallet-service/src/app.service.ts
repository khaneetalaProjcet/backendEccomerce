import { Model } from 'mongoose';
import {
  goldInvoice,
  goldInvoiceInterface,
} from './wallet/entities/goldBoxInvoice.entity';
import { InterserviceService } from './interservice/interservice.service';
import { Body, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  WalletInvoice,
  WalletInvoiceInterface,
} from './wallet/entities/walletInvoice.entity';
import { htmlPage } from './bah-pardakht/bah-pardakht';
import * as soap from 'soap';
import { wallet, walletDocument } from './wallet/entities/wallet.entity';

@Injectable()
export class AppService {
  private htmlPageService = new htmlPage();

  constructor(
    @InjectModel(WalletInvoice.name)
    private walletInvoiceModel: Model<WalletInvoiceInterface>,
    @InjectModel(wallet.name)
    private walletModel: Model<walletDocument>,
    @InjectModel(goldInvoice.name)
    private goldBoxInvoice: Model<goldInvoiceInterface>,
    private interservice: InterserviceService,
  ) {}

  async generator() {
    const randomString = new Date().getTime()
    return randomString.toString()
  }


  async requestPayment(order: any) {
    const data = {
      action: 'token',
      TerminalId: process.env.SEP_TERMINAL_ID,
      Amount: 10000,
      ResNum: await this.generator(),
      RedirectUrl: 'https://ecommerce.khaneetala.ir/v1/mainw/wallet/redirect',
      CellNumber: '09229055682',
    };

    try {
      const response = await fetch(
        'https://sep.shaparak.ir/onlinepg/onlinepg',
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' },
        },
      );

      const result = await response.json();

      if (result.status === 1 && result.token) {
        let wallet = await this.walletModel.findOne({
          owner : order.user
        })
        if (!wallet){
          return {
            message : 'سند مورد نظر معتبر نمی باشد',
            statusCode : 400,
            error : 'سند مورد نظر معتبر نمی باشد'
          }
        }
        console.log('token is' , result)
        let walletInvoice = await this.walletInvoiceModel.create({
          orderId: order._id,
          amount: order.totalPrice,
          status: 'pending',
          token : result.token,
          ResNum : data.ResNum,
          state: 1,
          wallet: wallet._id,
          });
          console.log('wallet invoice after creations' , walletInvoice )
        return {
          success: true,
          statusCode: 200,
          data: `https://sep.shaparak.ir/OnlinePG/SendToken?token=${result.token}`,
        };
      } else {
        console.error(`Token Error: ${result.errorCode} - ${result.errorDesc}`);
        return {
          success: false,
          statusCode: 400,
          error: {
            code: result.errorCode,
            description: result.errorDesc,
          },
        };
      }
    } catch (err) {
      console.error('Token Request Error:', err);
      return {
        success: false,
        statusCode: 500,
        error: 'Unexpected error while requesting token',
      };
    }
  }



  
  async requestPaymentForPayment2(order: any) {
    const data = {
      action: 'token',
      TerminalId: process.env.SEP_TERMINAL_ID,
      Amount: 10000,
      ResNum: await this.generator(),
      RedirectUrl: 'https://ecommerce.khaneetala.ir/test/redirect',
      CellNumber: '09229055682',
    };

    try {
      
      const response = await fetch(
        'https://sep.shaparak.ir/onlinepg/onlinepg',
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' },
        },
      );
      
      const result = await response.json();

      if (result.status === 1 && result.token) {
        let wallet = await this.walletModel.findOne({
          owner : order.user
        })
        if (!wallet){
          return {
            message : 'سند مورد نظر معتبر نمی باشد',
            statusCode : 400,
            error : 'سند مورد نظر معتبر نمی باشد'
          }
        }
        console.log('token is' , result)
        let walletInvoice = await this.walletInvoiceModel.create({
          orderId: order._id,
          amount: order.totalPrice,
          status: 'pending',
          token : result.token,
          ResNum : data.ResNum,
          state: 1,
          wallet: wallet._id,
          });
          console.log('wallet invoice after creations' , walletInvoice )
        return {
          success: true,
          statusCode: 200,
          data: `https://sep.shaparak.ir/OnlinePG/SendToken?token=${result.token}`,
        };
      } else {
        console.error(`Token Error: ${result.errorCode} - ${result.errorDesc}`);
        return {
          success: false,
          statusCode: 400,
          error: {
            code: result.errorCode,
            description: result.errorDesc,
          },
        };
      }
    } catch (err) {
      console.error('Token Request Error:', err);
      return {
        success: false,
        statusCode: 500,
        error: 'Unexpected error while requesting token',
      };
    }
  }



  async requestPayment2() {
    const data = {
      action: 'token',
      TerminalId: process.env.SEP_TERMINAL_ID,
      Amount: 15000,
      ResNum: '@#cc##',
      RedirectUrl: 'https://ecommerce.khaneetala.ir/',
      CellNumber: "09229055682"
    };

    try {
      const response = await fetch(
        'https://sep.shaparak.ir/onlinepg/onlinepg',
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' },
        },
      );

      const result = await response.json();

      if (result.status === 1 && result.token) {
        await this.walletInvoiceModel.create({
          action: 'token',
          TerminalId: process.env.SEP_TERMINAL_ID,
          Amount: 1000,
          ResNum: '123456',
          RedirectUrl: 'https://ecom.finatic.ir',
        });

        return {
          success: true,
          statusCode: 200,
          data: `https://sep.shaparak.ir/OnlinePG/SendToken?token=${result.token}`,
        };
      } else {
        console.error(`Token Error: ${result.errorCode} - ${result.errorDesc}`);
        return {
          success: false,
          statusCode: 400,
          error: {
            code: result.errorCode,
            description: result.errorDesc,
          },
        };
      }
    } catch (err) {
      console.error('Token Request Error:', err);
      return {
        success: false,
        statusCode: 500,
        error: 'Unexpected error while requesting token',
      };
    }
  }

  async verifyTransactionCallback(body: any) {
    const {
      State,
      Status,
      RefNum,
      ResNum, // orderId
      RRN, // referance Id  az bank
      TraceNo,
      TerminalId,
      Amount,
      Wage,
      SecurePan,
      HashedCardNumber,
    } = body;

    if (State !== 'OK' || Status !== '1') {
      await this.walletInvoiceModel.updateOne(
        { orderId: ResNum },
        {
          status: 'failed',
          state: -1,
          updatedAt: new Date(),
        },
      );

      return {
        success: false,
        message: `پرداخت لغو شده یا ناموفق (State: ${State}, Status: ${Status})`,
      };
    }

    const args = {
      RefNum,
      TerminalId: Number(process.env.SEP_TERMINAL_ID),
    };

    const wsdlUrl =
      'https://sep.shaparak.ir/PaymentsGateway/VerifyPayment.asmx?WSDL';

    try {
      const client = await soap.createClientAsync(wsdlUrl);
      const [result] = await client.VerifyTransactionAsync(args);
      const verifyAmount = Number(result.VerifyTransactionResult);

      if (verifyAmount > 0) {
        await this.walletInvoiceModel.updateOne(
          { orderId: ResNum },
          {
            status: 'success',
            state: 3,
            refNum: RefNum,
            rrn: RRN,
            traceNo: TraceNo,
            terminalId: TerminalId,
            affectiveAmount: verifyAmount,
            paymentDetail: {
              securePan: SecurePan,
              hashedCard: HashedCardNumber,
              wage: Wage,
            },
            updatedAt: new Date(),
          },
        );

        await this.interservice.updateorder(
          ResNum,
          {
            invoiceId: RefNum,
            paymentMethod: 1,
          },
          2,
        );

        return {
          success: true,
          message: 'پرداخت موفق',
          amount: verifyAmount,
        };
      } else {
        await this.walletInvoiceModel.updateOne(
          { orderId: ResNum },
          {
            status: 'failed',
            state: -2,
            updatedAt: new Date(),
          },
        );

        return {
          success: false,
          message: `خطای وریفای با کد: ${verifyAmount}`,
        };
      }
    } catch (error) {
      await this.walletInvoiceModel.updateOne(
        { orderId: ResNum },
        {
          status: 'failed',
          state: -99,
          updatedAt: new Date(),
        },
      );

      return {
        success: false,
        message: 'خطا در ارتباط با سرور وریفای',
        error,
      };
    }
  }

  // async redirectFromBehPardakht(body) {
  //   console.log('body from behpardakht', body)

  //   if (body.RefId) {
  //     let invoice = await this.walletInvoiceModel.findOne({ authority: body.RefId })
  //     invoice.paymentDetail = body;

  //     await invoice.save()

  //     if (body.ResCode == "0") {
  //       invoice.status == "completed"
  //       let productResponse = await this.interservice.updateorder(invoice.orderId , invoice.toObject() , 1)
  //       if (productResponse && productResponse.success){          // success
  //         invoice.state = 3
  //       }else{
  //         invoice.state = 2
  //       }
  //       await invoice.save()
  //     } else if (body.ResCode == "17") {
  //       invoice.status = 'failed'
  //       let productResponse = await this.interservice.updateorder(invoice.orderId, invoice.toObject() , 0)
  //       if (productResponse && productResponse.success){          // success
  //         invoice.state = 3
  //       }else{
  //         invoice.state = 2
  //       }
  //       await invoice.save()
  //       return {
  //         message: 'پرداخت نا موفق',
  //         statusCode: 301,
  //         data: await this.htmlPageService.failedPage("https://web.khaneetala.ir", "انصراف از درخواست")
  //       }
  //     } else {
  //       invoice.status = 'failed'
  //       let productResponse = await this.interservice.updateorder(invoice.orderId , invoice.toObject() , 0)
  //       if (productResponse && productResponse.success){          // success
  //         invoice.state = 3
  //       }else{
  //         invoice.state = 2
  //       }
  //       return {
  //         message: 'پرداخت نا موفق',
  //         statusCode: 301,
  //         data: await this.htmlPageService.failedPage("https://web.khaneetala.ir", "تراکنش نا موفق،در صورت کسر وجه مبلغ تا چند ساعت آینده به حساب شما واریز میگردد")
  //       }
  //     }
  //   }else{
  //     return {
  //       message : 'پرداخت نا موفق',
  //       statusCode : 301,
  //       data : await this.htmlPageService.successPage("https://web.khaneetala.ir")
  //     }
  //   }
  // }

  // async redirectFromBehPardakhtForSecondPayment(body) {
  //   console.log('body from behpardakht', body)

  //   // first update the goldBoxInvoice in khanetala.ir
  //   // second update the both invoices in product service

  //   if (body.RefId) {
  //     let invoice = await this.walletInvoiceModel.findOne({ authority: body.RefId })
  //     let goldBoxInvoice = await this.goldBoxInvoice.findById(invoice.walletInvoice)
  //     invoice.paymentDetail = body;

  //     await invoice.save()

  //     if (body.ResCode == "0") {
  //       invoice.status == "completed"
  //       goldBoxInvoice.status = "completed"

  //       let responseOfKhanetala = await this.interservice.updateGoldBox(goldBoxInvoice.toObject())

  //       if (responseOfKhanetala && responseOfKhanetala.success){
  //         goldBoxInvoice.state = 2
  //         let productResponse = await this.interservice.updateorder(invoice.orderId , invoice.toObject() , 1)
  //         if (productResponse && productResponse.success){          // success
  //           invoice.state = 3
  //           goldBoxInvoice.state = 4
  //         }else{
  //           invoice.state = 2
  //           goldBoxInvoice.state = 3
  //         }
  //         await invoice.save()
  //         await goldBoxInvoice.save()
  //       }else{
  //         goldBoxInvoice.state = 1
  //       }

  //     } else if (body.ResCode == "17") {
  //       invoice.status = 'failed'
  //       goldBoxInvoice.status = "failed"
  //       let productResponse = await this.interservice.updateorder(invoice.orderId, invoice.toObject() , 0)
  //       if (productResponse && productResponse.success){          // success
  //         invoice.state = 3
  //         goldBoxInvoice.state = 4
  //       }else{
  //         invoice.state = 2
  //         goldBoxInvoice.state = 3
  //       }
  //       await invoice.save()
  //       await goldBoxInvoice.save()
  //       return {
  //         message: 'پرداخت نا موفق',
  //         statusCode: 301,
  //         data: await this.htmlPageService.failedPage("https://web.khaneetala.ir", "انصراف از درخواست")
  //       }
  //     } else {
  //       invoice.status = 'failed'
  //       goldBoxInvoice.status = "failed"
  //       let productResponse = await this.interservice.updateorder(invoice.orderId , invoice.toObject() , 0)
  //       if (productResponse && productResponse.success){          // success
  //         invoice.state = 3
  //         goldBoxInvoice.state = 4
  //       }else{
  //         invoice.state = 2
  //         goldBoxInvoice.state = 3
  //       }
  //       return {
  //         message: 'پرداخت نا موفق',
  //         statusCode: 301,
  //         data: await this.htmlPageService.failedPage("https://web.khaneetala.ir", "تراکنش نا موفق،در صورت کسر وجه مبلغ تا چند ساعت آینده به حساب شما واریز میگردد")
  //       }
  //     }
  //   }else{
  //     return {
  //       message : 'پرداخت نا موفق',
  //       statusCode : 301,
  //       data : await this.htmlPageService.successPage("https://web.khaneetala.ir")
  //     }
  //   }
  // }
}
