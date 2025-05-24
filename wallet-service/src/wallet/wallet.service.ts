import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectModel } from '@nestjs/mongoose';
import {walletDocument} from "./entities/wallet.entity"
import { Model } from 'mongoose';

@Injectable()
export class WalletService {
  constructor(@InjectModel('wallet') private walletModel: Model<walletDocument>){}
  async create(createWalletDto: CreateWalletDto) {
   
    const time= new Date().toLocaleString('fa-IR').split(',')[1]
    const date= new Date().toLocaleString('fa-IR').split(',')[0]
    const wallet=await this.walletModel.create({
      owner:createWalletDto.owner,
      balance:createWalletDto.balance,
      goldWeight:createWalletDto.goldWeight,
      date,
      time
    })
    
    return wallet;
  }

  findAll() {
    return `This action returns all wallet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  update(id: number, updateWalletDto: UpdateWalletDto) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
