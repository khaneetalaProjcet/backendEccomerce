import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from './entities/user.entity';
import {compelteRegisterDto} from "./dto/completeRegister.dto"
import {InterserviceService} from "../interservice/interservice.service"
import { Model } from 'mongoose';
import { refreshTokenDto } from 'src/auth/dto/refreshTokenDto.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('userM') private userModel: Model<UserDocument>,private readonly internalService:InterserviceService,
  ) {}

  

  async checkOrCreate(phoneNumber:string){
    try{
      const user=await this.userModel.findOne({phoneNumber : phoneNumber})
      console.log('user after getting' , user)
      if(!user){
        const oldUser=await this.internalService.checkExistOldUser(phoneNumber)
        if(oldUser.data.statusCode==2){
          return ;
        }
        if(oldUser&&oldUser.statusCode==1){
           console.log("oldUser",oldUser);
 
           const oldNewUser=await this.userModel.create({
            phoneNumber,
            firstName:oldUser.data.firstName,
            lastName:oldUser.data.lastName,
            fatherName:oldUser.data.fatherName,
            authStatus:3
           })



           return oldNewUser
           
        }else{
          let newUser=await this.userModel.create({phoneNumber : phoneNumber , authStatus:1})
          return newUser
        }
          
      }
      return user
      
    }catch(error){
      console.log(error);
    }
  }


  async completeRegister(userId:string,data:compelteRegisterDto){
    try{
      console.log(userId);
      const testUser=await this.userModel.findOne({_id:userId})
      console.log("textUser",testUser);
      
      const user=await this.userModel.findByIdAndUpdate(userId,{
        firstName:data.firstName,
        lastName:data.lastName,
        fatherName:data.fatherName,
        adresses:data.adresses,
        email:data.email,
        authStatus:2
      })
      console.log(user);
      
      if(!user){
        return {
          message: 'کاربر پیدا نشد',
          statusCode: 400,
          error: 'کاربر پیدا نشد'
        }
      }

      return {
        message: 'ثبت نام شما کامل شد',
        statusCode: 200,
        data: user
      }

    }
    catch(error){
      console.log("error",error);
      return {
        message: 'مشکلی از سمت سرور به وجود آمده',
        statusCode: 500,
        error: 'خطای داخلی سیستم'
      }
    }
  }


  async findById(userId:string){
    try{
      const user=await this.userModel.findById(userId)
      if(!user){
        return {
          message: 'کاربر پیدا نشد',
          statusCode: 400,
          error: 'کاربر پیدا نشد'
        }
      }
      return {
        message: 'ثبت نام شما کامل شد',
        statusCode: 200,
        data: user
      }
    }catch(error){
      console.log("error",error);
      return {
        message: 'مشکلی از سمت سرور به وجود آمده',
        statusCode: 500,
        error: 'خطای داخلی سیستم'
      }
    }
  
  }



  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
