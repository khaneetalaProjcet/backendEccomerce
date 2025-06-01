import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AdminService } from 'src/admin/admin.service';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';
import { TokenizeService } from 'src/tokenize/tokenize.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly adminService:AdminService , private readonly tokenize:TokenizeService){}


  async registe(data:CreateAdminDto){
    return this.adminService.register(data)
  }

  async login(phoneNumber:string,password:string){
    try{
       const admin= await this.adminService.findByPhoneNumber(phoneNumber)
     if(!admin){
        return {
          message: 'کاربر پیدا نشد',
          statusCode: 400,
          error: 'کاربر پیدا نشد'
        }
     }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return {
          message: 'اطلاعات درست نمی باشد',
          statusCode: 400,
          error: 'اطلاعات درست نمی باشد'
        }
    }

     const token = await this.tokenize.tokenize({ _id: admin?._id, phoneNumber: admin?.phoneNumber }, "12h", 0)

     return {
        message: 'خوش امدید',
        statusCode: 200,
        data: token
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

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
