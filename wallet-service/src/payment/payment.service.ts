import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppService } from 'src/app.service';
import { BahPardakht } from 'src/bah-pardakht/bah-pardakht';
import { InterserviceService } from 'src/interservice/interservice.service';
import {
  goldInvoice,
  goldInvoiceInterface,
} from 'src/wallet/entities/goldBoxInvoice.entity';
import { wallet, walletDocument } from 'src/wallet/entities/wallet.entity';
import {
  WalletInvoice,
  WalletInvoiceInterface,
} from 'src/wallet/entities/walletInvoice.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(WalletInvoice.name)
    private walletInvoiceModel: Model<WalletInvoiceInterface>,
    @InjectModel(goldInvoice.name)
    private goldInvoiceModel: Model<goldInvoiceInterface>,
    @InjectModel(wallet.name) private walletModel: Model<walletDocument>,
    private interService: InterserviceService,

    private appService: AppService,
  ) {}

  private async generateInvoice() {
    let all = await this.walletInvoiceModel.countDocuments();
    let status = true;
    while (status) {
      let check = await this.walletInvoiceModel.find({ invoiceId: all });
      if (check.length == 0) {
        status = false;
      } else {
        all = all + 1;
      }
    }
    return all;
  }

  // ///////////////////////////////////////////////////
  // /**
  //  * this module is for going to gateway for payment
  //  * @param body
  //  * @returns
  //  */
  // ///////////////////////////////////////////////////
  // private async gateway(body) {
  //   let wallet = await this.walletModel.findOne({ owner: body.user });
  //   let initInvoice = await this.walletInvoiceModel.create({
  //     amount: body.totalPrice,

  //     orderId: body._id,

  //     wallet: wallet?._id,

  //     invoiceId: await this.generateInvoice(),

  //     status: 'init',

  //     date: new Date().toLocaleString('fa-IR').split(',')[0],

  //     time: new Date().toLocaleString('fa-IR').split(',')[1],
  //   });

  //   const info = {
  //     terminalId: 7374865,
  //     userName: '7374865',
  //     userPassword: '84915185',
  //     orderId: +initInvoice.invoiceId,
  //     amount: initInvoice.amount,
  //     localDate: '14030310',
  //     localTime: '143000',
  //     additionalData: '',
  //     callBackUrl: 'https://shop.khaneetala.ir/v1/mainw/redirect',
  //     payerId: 0,
  //     encPan: '',
  //   };

  //   const bpm = await BahPardakht.create();
  //   const responseOfBuyProcess = await bpm.bpPayRequest(info);

  //   console.log('code', responseOfBuyProcess.return.split(',')[0]);

  //   if (responseOfBuyProcess.return.split(',')[0] == '0') {
  //     // it means that it is success
  //     initInvoice.status = 'pending';
  //     initInvoice.authority = responseOfBuyProcess.return.split(',')[1];
  //     initInvoice.state = 1;
  //     await initInvoice.save();
  //     return {
  //       // after saving data
  //       message: 'transfer to gateway',
  //       statusCode: 200,
  //       data: responseOfBuyProcess.return.split(',')[1],
  //     };
  //   } else {
  //     (initInvoice.status = 'failed'),
  //       (initInvoice.authority = responseOfBuyProcess?.return?.split(',')[1]);
  //     await initInvoice.save();
  //     return {
  //       message: 'درگاه پرداخت موقتا در دسترس نمی باشد.لطفا مجددا تلاش کنید',
  //       statusCode: 500,
  //       error: 'درگاه پرداخت موقتا در دسترس نمی باشد.لطفا مجددا تلاش کنید',
  //     };
  //   }
  // }

  // ///////////////////////////////////////////////////
  // /**
  //  * this module is for while the user want to pay with goldBox and gateway
  //  * @param body
  //  * @returns
  //  */
  // ///////////////////////////////////////////////////
  // private async gatewayAndGoldBoxPayment(body) {
  //   let wallet = await this.walletModel.findOne({ owner: body.user });
  //   let walletInvoiceInitial = await this.walletInvoiceModel.create({
  //     amount: body.totalPrice,

  //     orderId: body._id,

  //     wallet: wallet?._id,

  //     ivnoiceId: await this.generateInvoice(),

  //     status: 'init',

  //     date: new Date().toLocaleString('fa-IR').split(',')[0],

  //     time: new Date().toLocaleString('fa-IR').split(',')[1],
  //   });

  //   let goldBoxInvoiceInitial = await this.goldInvoiceModel.create({
  //     goldWeight: +body.goldBox,
  //     orderId: body._id,
  //     invoiceId: await this.generateInvoice(),
  //     wallet: wallet?._id,
  //     status: 'init',
  //     date: new Date().toLocaleString('fa-IR').split(',')[0],
  //     time: new Date().toLocaleString('fa-IR').split(',')[1],
  //   });

  //   const info = {
  //     terminalId: 7374865,
  //     userName: '7374865',
  //     userPassword: '84915185',
  //     orderId: +walletInvoiceInitial.invoiceId,
  //     amount: walletInvoiceInitial.amount,
  //     localDate: '14030310',
  //     localTime: '143000',
  //     additionalData: goldBoxInvoiceInitial._id.toString(),
  //     callBackUrl: 'https://shop.khaneetala.ir/v1/mainw/redirect/secondPayment',
  //     payerId: 0,
  //     encPan: '',
  //   };

  //   const bpm = await BahPardakht.create();
  //   const responseOfBuyProcess = await bpm.bpPayRequest(info);

  //   if (responseOfBuyProcess.return.split(',')[0] == '0') {
  //     // it means that it is success
  //     walletInvoiceInitial.status = 'pending';
  //     walletInvoiceInitial.authority =
  //       responseOfBuyProcess.return.split(',')[1];
  //     walletInvoiceInitial.state = 1;
  //     await walletInvoiceInitial.save();
  //     return {
  //       // after saving data
  //       message: 'transfer to gateway',
  //       statusCode: 200,
  //       data: responseOfBuyProcess.return.split(',')[1],
  //     };
  //   } else {
  //     (walletInvoiceInitial.status = 'failed'),
  //       (walletInvoiceInitial.authority =
  //         responseOfBuyProcess?.return?.split(',')[1]);
  //     await walletInvoiceInitial.save();
  //     return {
  //       message: 'درگاه پرداخت موقتا در دسترس نمی باشد.لطفا مجددا تلاش کنید',
  //       statusCode: 500,
  //       error: 'درگاه پرداخت موقتا در دسترس نمی باشد.لطفا مجددا تلاش کنید',
  //     };
  //   }
  // }

  // /**
  //  * this module is for pay the invoice just with goldBox
  //  * @param body
  //  */
  // async justGoldBox(body) {
  //   let wallet = await this.walletModel.findOne({ owner: body.user });
  //   let goldBoxInvoiceInitial = await this.goldInvoiceModel.create({
  //     goldWeight: +body.goldBox,
  //     orderId: body._id,
  //     invoiceId: await this.generateInvoice(),
  //     wallet: wallet?._id,
  //     status: 'init',
  //     date: new Date().toLocaleString('fa-IR').split(',')[0],
  //     time: new Date().toLocaleString('fa-IR').split(',')[1],
  //   });

  //   // let khaneetalaResponse = await this.interService.updateGoldBox(goldBoxInvoiceInitial)
  //   // if (khaneetalaResponse && khaneetalaResponse.success){
  //   let khaneetalaResponse = true;
  //   if (khaneetalaResponse) {
  //     let updated = await this.goldInvoiceModel.findByIdAndUpdate(
  //       goldBoxInvoiceInitial._id,
  //       { state: 2, status: 'completed' },
  //     );

  //     const order = await this.interService.updateorder(
  //       body._id,
  //       goldBoxInvoiceInitial,
  //       1,
  //     );

  //     console.log('order', order);

  //     return {
  //       message: 'خرید با موفقیت انجام شد',
  //       statusCode: 200,
  //       data: updated,
  //     };
  //   } else {
  //     let updated = await this.goldInvoiceModel.findByIdAndUpdate(
  //       goldBoxInvoiceInitial._id,
  //       { state: 1, status: 'completed' },
  //     );
  //     return {
  //       message: 'خرید در مرحله ی انجام است',
  //       statusCode: 200,
  //       data: updated,
  //     };
  //   }
  // }

  ////// pay with goldbox //////

  async payWithGoldBox(body) {
  
    console.log('its start the mix payment')

    if (body.paymentMethod !== 2){
      return {
        message : 'فاکتور مورد نظر نا معتبر است',
        statusCode : 400,
        error : 'فاکتور مورد نظر نا معتبر است'
      }
    }


    let wallet = await this.walletModel.findOne({
      owner : body.user
    })


    if (!wallet) {
      return {
        message: 'فاکتور مورد نظر نا معتبر است',
        statusCode: 400,
        error: 'فاکتور مورد نظر نا معتبر است'
      }
    }


    let goldBoxInvoice = await this.goldInvoiceModel.create({
      goldWeight: body.goldBox,
      orderId: body._id,
      invoiceId: (await this.generateInvoice()).toString(),
      wallet: wallet._id,
      status: 'pending',
      date: new Date().toLocaleString('fa-IR').split(',')[0],
      time: new Date().toLocaleString('fa-IR').split(',')[1],
      state: 0,
    })
    console.log('after creation gold box invoice' , goldBoxInvoice)
    return this.appService.requestPaymentForPayment2(body)
    
  }

  /**
   * this module is payment handler
   * @param body
   * @returns
   */
  async paymentHandler(body: any) {
    if (body.paymentMethod == 1) {
      // gateway
      return this.appService.requestPayment(body);
    }

    if (body.paymentMethod == 2) {
      // gateway and goldBox
      console.log('gateway and goldbox');
      return this.payWithGoldBox(body);
    }
  }
}
