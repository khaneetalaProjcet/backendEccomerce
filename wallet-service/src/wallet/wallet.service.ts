import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { walletDocument } from './entities/wallet.entity';
import { Model, ClientSession } from 'mongoose';
import { responseInterface } from 'src/interfaces/interfaces.interface';
import { htmlPage, InterserviceService } from 'src/interservice/interservice.service';
import { PaymentService } from 'src/payment/payment.service';
import { AppService } from 'src/app.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel('wallet') private walletModel: Model<walletDocument>,
    private interService: InterserviceService,
    private payments: AppService,
    private pageGenerator = new htmlPage(),
    private paymentHandler: PaymentService,

  ) {}

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

      console.log('here after getting from fucking order service' , order.paymentMethod);

     return this.paymentHandler.paymentHandler(order);
    }
  }


  async redirectFromGateway(body : any){
    console.log( 'it comes in to the redirect', body)
    let page = await this.pageGenerator.failedPage('https://ecommerce.khaneetala.ir/' , 'انصراف از درخواست')
    return {
      message : 'page',
      statusCode : 301,
    page
    }
  }


}
