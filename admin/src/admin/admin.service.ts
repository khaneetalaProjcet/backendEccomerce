import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin,AdminDocument } from './entities/admin.entity';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin.name) private adminModel: Model<AdminDocument>){}
  
  async register(dto: CreateAdminDto) {
    try{
       const existing = await this.adminModel.findOne({ phoneNumber: dto.phoneNumber });
    if (existing) {
      return {
          message: 'کاربر وجود دارد',
          statusCode: 400,
          error: 'کاربر وجود دارد'
      }
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const admin = new this.adminModel({
      ...dto,
      password: hashedPassword,
    });

    await admin.save();
    return {
        message: 'ثبت نام شما کامل شد',
        statusCode: 200,
        data: admin
    }
    }catch(error){
      console.log('error is sending otp', error)
      return {
        message: 'مشکلی از سمت سرور به وجود آمده',
        statusCode: 500,
        error: 'خطای داخلی سیستم'
      }
    }
    
  }


  async findByPhoneNumber(phoneNumber:string){
    const admin=await this.adminModel.findOne({phoneNumber})
    if(!admin){
      return null
    }
    return admin
  }


  async findById(id:string){
    
    const admin=await this.adminModel.findById(id)
    if(!admin){
      return {
          message: 'کاربر وجود ندارد',
          statusCode: 400,
          error: 'کاربر وجود ندارد'
      }
    }
    return {
       message: 'ثبت نام شما کامل شد',
        statusCode: 200,
        data: admin
    }
  }



  findAll() {
    return `This action returns all admin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
