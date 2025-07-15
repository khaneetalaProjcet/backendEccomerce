import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { walletDocument } from './entities/wallet.entity';
import { Model, ClientSession } from 'mongoose';
import { responseInterface } from 'src/interfaces/interfaces.interface';
import { InterserviceService } from 'src/interservice/interservice.service';
import { PaymentService } from 'src/payment/payment.service';
import { AppService } from 'src/app.service';
import {
  WalletInvoice,
  WalletInvoiceInterface,
} from './entities/walletInvoice.entity';
import { goldInvoice,goldInvoiceInterface } from './entities/goldBoxInvoice.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel('wallet') private walletModel: Model<walletDocument>,
    private interService: InterserviceService,
    @InjectModel(WalletInvoice.name)
    private walletInvoiceModel: Model<WalletInvoiceInterface>,
        @InjectModel(goldInvoice.name)
    private golldBoxModel: Model<goldInvoiceInterface>,
    private payments: AppService,

    private paymentHandler: PaymentService,
  ) {}

  private async successPage(backUrl: string) {
    return `
      <!DOCTYPE html>
<html lang="fa" dir="rtl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet"
        type="text/css" />
    <title>خانه طلا | نتیجه پرداخت</title>
</head>

<body>
    <main class="layout">
        <div>
            <div class="d-flex">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="96px" height="96px">
                    <path fill="#4caf50"
                        d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z" />
                    <path fill="#ccff90"
                        d="M34.602,14.602L21,28.199l-5.602-5.598l-2.797,2.797L21,33.801l16.398-16.402L34.602,14.602z" />
                </svg>
            </div>
            <div class="my-8">
                <p class="payment-text">پرداخت شما <span class="text-red">موفق</span> بوده است</p>
            </div>
            <div>
                <a href=${backUrl} class="mt-2 back-link">بازگشت به صفحه اصلی</a>
            </div>
        </div>
    </main>
</body>

</html>

<style>
    .layout {
        height: 90vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-family: 'vazirmatn';
    }

    .layout>div {
        background-color: rgba(254, 253, 251, 1);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
    }

    .layout .content {
        margin: 2rem 0;
        box-shadow: 4px 4px 12px 0px rgba(212, 205, 191, 0.4);
        backdrop-filter: blur(12px);
        padding: 48px;
        min-width: 90%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    @media (min-width: 768px) {
        .layout .content {
            min-width: 50%;
        }
    }

    .payment-image {
        max-width: 100%;
        height: auto;
    }

    .payment-text {
        font-size: 20px;
        margin: 4rem 0;
    }

    .back-link {
        margin-top: 2rem;
        text-decoration: none;
        width: 5rem;
        height: 2rem;
        padding: 0.5rem 1rem;
        background-color: #876824;
        color: #fff;
        border-radius: 8px;
    }

    .back-link:hover {
        background-color: #977939;
        color: #fff;
    }

    .back-link:active {
        background-color: #ab9056;
        color: #fff;
    }
</style>
    `;
  }

  private async failedPage(backUrl: string, reason: string) {
    return `
    <!DOCTYPE html>
<html lang="fa" dir="rtl">
  
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet"
        type="text/css" />
    <title>خانه طلا | نتیجه پرداخت</title>
</head>

<body>
    <main class="layout">
        <div>
            <div class="d-flex">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="96px" height="96px">
                    <linearGradient id="hbE9Evnj3wAjjA2RX0We2a" x1="7.534" x2="27.557" y1="7.534" y2="27.557"
                        gradientUnits="userSpaceOnUse">
                        <stop offset="0" stop-color="#f44f5a" />
                        <stop offset=".443" stop-color="#ee3d4a" />
                        <stop offset="1" stop-color="#e52030" />
                    </linearGradient>
                    <path fill="url(#hbE9Evnj3wAjjA2RX0We2a)"
                        d="M42.42,12.401c0.774-0.774,0.774-2.028,0-2.802L38.401,5.58c-0.774-0.774-2.028-0.774-2.802,0	L24,17.179L12.401,5.58c-0.774-0.774-2.028-0.774-2.802,0L5.58,9.599c-0.774,0.774-0.774,2.028,0,2.802L17.179,24L5.58,35.599	c-0.774,0.774-0.774,2.028,0,2.802l4.019,4.019c0.774,0.774,2.028,0.774,2.802,0L42.42,12.401z" />
                    <linearGradient id="hbE9Evnj3wAjjA2RX0We2b" x1="27.373" x2="40.507" y1="27.373" y2="40.507"
                        gradientUnits="userSpaceOnUse">
                        <stop offset="0" stop-color="#a8142e" />
                        <stop offset=".179" stop-color="#ba1632" />
                        <stop offset=".243" stop-color="#c21734" />
                    </linearGradient>
                    <path fill="url(#hbE9Evnj3wAjjA2RX0We2b)"
                        d="M24,30.821L35.599,42.42c0.774,0.774,2.028,0.774,2.802,0l4.019-4.019	c0.774-0.774,0.774-2.028,0-2.802L30.821,24L24,30.821z" />
                </svg>

            </div>
            <div class="my-8">
                <p class="payment-text">${reason}</p>
            </div>
            <div>
                <a href=${backUrl} class="mt-2 back-link">بازگشت به صفحه اصلی</a>
            </div>
        </div>
    </main>

    </body>

</html>

<style>
    .layout {
        height: 90vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-family: 'vazirmatn';
    }

    .layout>div {
        background-color: rgba(254, 253, 251, 1);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
    }

    .layout .content {
        margin: 2rem 0;
        box-shadow: 4px 4px 12px 0px rgba(212, 205, 191, 0.4);
        backdrop-filter: blur(12px);
        padding: 48px;
        min-width: 90%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    @media (min-width: 768px) {
        .layout .content {
            min-width: 50%;
        }
    }

    .payment-image {
        max-width: 100%;
        height: auto;
    }

    .payment-text {
        font-size: 20px;
        margin: 4rem 0;
    }

    .back-link {
        margin-top: 2rem;
        text-decoration: none;
        width: 5rem;
        height: 2rem;
        padding: 0.5rem 1rem;
        background-color: #876824;
        color: #fff;
        border-radius: 8px;
    }

    .back-link:hover {
        background-color: #977939;
        color: #fff;
    }

    .back-link:active {
        background-color: #ab9056;
        color: #fff;
    }
</style>
    `;
  }

  async create(createWalletDto: CreateWalletDto) {
    // const array= await this.walletModel.find()
    // for (let index = 0; index < array.length; index++) {
    //   const element = array[index];

    //   await this.walletModel.findByIdAndDelete(element._id)

    // }
    // const session: ClientSession = await this.walletModel.db.startSession();
    // session.startTransaction();
    console.log('wallet creation', createWalletDto);
    try {
      const time = new Date().toLocaleString('fa-IR').split(',')[1];
      const date = new Date().toLocaleString('fa-IR').split(',')[0];
      const wallet = await this.walletModel.create({
        owner: createWalletDto.owner,
        balance: createWalletDto.balance,
        goldWeight: createWalletDto.goldWeight.toString(),
        date,
        time,
      });
      console.log('created wallet', wallet);
      // await session.commitTransaction();
      return {
        message: '',
        statusCode: 200,
        data: wallet,
      };
    } catch (err) {
      // await session.abortTransaction();
      console.log('error in creation of wallet', err);
      return {
        message: 'مشکلی از سمت سرور به وجود آمده',
        statusCode: 500,
        error: 'خطای داخلی سیستم',
      };
    } finally {
      console.log('asdfadsfadsfasdfsfda');
      // session.endSession();
    }
  }

  async findSpecificUserWallet(req: any, res: any): Promise<responseInterface> {
    let userId: string = req.user.userId;
    let wallet = await this.walletModel.findOne({ owner: userId });
    // const all=await this.walletModel.find()

    // const wallet=all[0]

    console.log('its wallet ', wallet);

    if (!wallet) {
      return {
        message: 'کیف پول کاربر مورد نظر یافت نشد',
        statusCode: 400,
        error: 'کیف پول کاربر مورد نظر یافت نشد',
      };
    }
    return {
      message: 'دریافت کیف پول کاربر',
      statusCode: 200,
      data: wallet,
    };
  }

  findAll() {
    return `This action returns all wallet`;
  }


async findGolBoxInvoice(query: any) {
  try {
    const limit = Number(query.limit) || 12;
    const page = Number(query.page) || 0;
    const skip = page * limit;

    const [invoices, total] = await Promise.all([
      this.golldBoxModel
        .find()
        .skip(skip)
        .limit(limit),
      this.golldBoxModel.countDocuments(),
    ]);

    return {
      message: '',
      statusCode: 200,
      data: invoices,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'مشکل داخلی سیستم',
      statusCode: 500,
      error: 'مشکل داخلی سیستم',
    };
  }
}

async findWalletInvoice(query: any) {
  try {
    const limit = Number(query.limit) || 12;
    const page = Number(query.page) || 0;
    const skip = page * limit;

    const [invoices, total] = await Promise.all([
      this.walletInvoiceModel
        .find()
        .skip(skip)
        .limit(limit),
      this.walletInvoiceModel.countDocuments(),
    ]);

    return {
      message: '',
      statusCode: 200,
      data: invoices,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'مشکل داخلی سیستم',
      statusCode: 500,
      error: 'مشکل داخلی سیستم',
    };
  }
}


  async findOne(owner: string) {
    const wallet = await this.walletModel.findOne({ owner });
    return {
      message: '',
      statusCode: 200,
      data: wallet,
    };
  }

  update(id: number, updateWalletDto: UpdateWalletDto) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }

  async payOrder(orderId: string) {
    console.log('order id', orderId);

    let order = await this.interService.getOrder(orderId);

    if (order == 0) {
      console.log('internal services error , not connected to order service');
      return {
        message: 'خطای بین سرویس',
        statusCode: 503,
        error: 'خطای بین سرویس',
      };
    } else if (order == 'orderNotFound') {
      console.log('orderNotFound from order product');
      return {
        message: 'محصول مورد نظر برای ادامه خرید پیدا نشد',
        statusCode: 400,
        error: 'محصول مورد نظر برای ادامه خرید پیدا نشد ',
      };
    } else if (order == 'unknown') {
      console.log('unknown error in getting product');
      return {
        message: 'خطای داخلی سرور',
        statusCode: 503,
        error: 'خطای داخلی سرور',
      };
    } else {
      if (order._id.toString() !== orderId) {
        // if the order was not the main order that i want
        console.log('the order is not the same >>>>', orderId, order._id);
        return {
          message: 'خطای داخلی سرور',
          statusCode: 503,
          error: 'خطای داخلی سرور',
        };
      }

      // let { paymentMethod } = order.paymentMethod      // its the payment method

      console.log(
        'here after getting from fucking order service',
        order.paymentMethod,
      );

      return this.paymentHandler.paymentHandler(order);
    }
  }


  async redirectFromGateway(body : any){
    console.log( 'it comes in to the redirect', body)
    let page = ''
    let walletInvoice : any = await this.walletInvoiceModel.findOne({
      ResNum: body.ResNum
    })
    try {
      if (!walletInvoice) {
      console.log('wallet invoice not exits')
      page = await this.failedPage('https://ecommerce.khaneetala.ir/', 'تراکنش نا معتبر')
    } else {
      console.log('wallet invoice is >>>> ', walletInvoice)
      if (body.State === 'CanceledByUser') {   // canceled by user stat 1
        console.log('the payment is canceled by user')
        walletInvoice.status = 'failed'
        await walletInvoice.save()
        page = await this.failedPage('https://ecommerce.khaneetala.ir/', 'انصراف از درخواست')
        return {
          message: 'page',
          statusCode: 301,
          page
        }
      } else if (body.State === 'OK') {     // ok state 2 here we should double check the transActions
        console.log('ok the transActions')
        
        let responseOfVerification = await this.interService.verifyTransAction(body.RefNum)

        if (responseOfVerification && responseOfVerification.success) {     // of the transAction was success
          console.log('transAction succeeded')
          walletInvoice.payment = responseOfVerification.TransactionDetail;
          walletInvoice.status = 'completed'
          walletInvoice.RefNum = body.RefNum;
          walletInvoice.traceNo = body.TraceNo
          let orderUpdated = await this.interService.aprovePey(walletInvoice.orderId.toString(), 1, walletInvoice)
          if (orderUpdated === 1) {
            walletInvoice.state = 3
          } else {
            walletInvoice.state = 2
          }
          console.log('response of order updated', orderUpdated)
          await walletInvoice.save()
          page = await this.successPage('https://ecommerce.khaneetala.ir/')
          return {
            message: 'page',
            statusCode: 301,
            page
          }
        } else {
          page = await this.failedPage('https://ecommerce.khaneetala.ir/', 'تراکنش نا موفق بود در صورت کسر وجه مبلغ تا 24 ساعت آینده به حساب شما واریز می شود.')
          console.log('finallllll')
          return {
            message: 'page',
            statusCode: 301,
            page
          }
        }
      } else if (body.State === 'Failed') {      // failed state 3
        console.log('the payment is canceled by user')
        walletInvoice.status = 'failed'
        await walletInvoice.save()
        page = await this.failedPage('https://ecommerce.khaneetala.ir/', 'تراکنش نا موفق بود در صورت کسر وجه مبلغ تا 24 ساعت آینده به حساب شما واریز می شود.')
        console.log('finallllll')
        return {
          message: 'page',
          statusCode: 301,
          page
        }
      } else {      // everything else state 4
        console.log('the payment is canceled by user')
        walletInvoice.status = 'failed'
        await walletInvoice.save()
        page = await this.failedPage('https://ecommerce.khaneetala.ir/', 'تراکنش نا موفق بود در صورت کسر وجه مبلغ تا 24 ساعت آینده به حساب شما واریز می شود.')
        console.log('finallllll')
        return {
          message: 'page',
          statusCode: 301,
          page
        }
      }
    }
    } catch (error) {
      console.log('error in redirect to api', error)
      page = await this.failedPage('https://ecommerce.khaneetala.ir/', 'تراکنش نا موفق بود در صورت کسر وجه مبلغ تا 24 ساعت آینده به حساب شما واریز می شود.')
      return {
        message: 'page',
        statusCode: 400,
        page
      }
    }
  }
}
