import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectModel } from '@nestjs/mongoose';
import {walletDocument} from "./entities/wallet.entity"
import { Model, ClientSession} from 'mongoose';
import { responseInterface } from 'src/interfaces/interfaces.interface';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel('wallet') private walletModel: Model<walletDocument>,
  ) {}

  async create(createWalletDto: CreateWalletDto) {
    // const array= await this.walletModel.find()
    // for (let index = 0; index < array.length; index++) {
    //   const element = array[index];

    //   await this.walletModel.findByIdAndDelete(element._id)

    // }
    const session: ClientSession = await this.walletModel.db.startSession();
    session.startTransaction();

    try {
      const time = new Date().toLocaleString('fa-IR').split(',')[1];
      const date = new Date().toLocaleString('fa-IR').split(',')[0];
      const wallet = await this.walletModel.create(
        [
          {
            owner: createWalletDto.owner,
            balance: createWalletDto.balance,
            goldWeight: createWalletDto.goldWeight,
            date,
            time,
          },
        ],
        { session },
      );
      return {
        message: '',
        statusCode: 200,
        data: wallet[0],
      };
    } catch (err) {
      await session.abortTransaction();
      return {
        message: 'مشکلی از سمت سرور به وجود آمده',
        statusCode: 500,
        error: 'خطای داخلی سیستم',
      };
    } finally {
      session.endSession();
    }
  }

  async findSpecificUserWallet(req : any , res : any ): Promise<responseInterface> {
    let userId : string = req.user.userId
    let wallet = await this.walletModel.findOne({ 'owner.id': userId });

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
}
