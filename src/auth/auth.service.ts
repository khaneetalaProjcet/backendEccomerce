import { Inject, Injectable, Req, Res } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { sendOtpDto } from './dto/sendOtpDto.dto';
import { RedisServiceService } from 'src/redis-service/redis-service.service';
import { UserService } from 'src/user/user.service';
import { TokenizeService } from 'src/tokenize/tokenize.service';
import { json } from 'stream/consumers';
import { validateOtpDto } from './dto/validateOtpDto.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/user/entities/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager'


@Injectable()
export class AuthService {

  constructor(private redisService: RedisServiceService , private userServiceL:UserService,private tokenize:TokenizeService,
    @InjectModel('userM') private userModel : Model<UserDocument>,
    @Inject(CACHE_MANAGER) private readonly cache : Cache
  ) {}

  private async otpGenerator() {
    return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
  }

  async sendOtp(@Req() req: any, @Res() res: any, body: sendOtpDto) {
    try {

      let { phoneNumber } = body;

      let otp = await this.otpGenerator()
      let data = { otp: otp, date: new Date().getTime() }
      

      await this.redisService.setOtp(`otp-${phoneNumber}`,JSON.stringify(data))
      

     
     
      return {
        message: 'ارسال کد تایید موفق',
        statusCode: 200,
        data: otp
      }
    } catch (error) {
      console.log('error is sending otp', error)
      return {
        message: 'ارسال کد تایید ناموفق',
        statusCode: 500,
        error: 'خطای داخلی سیستم'
      }
    }
  }



  async validateOtp(body : validateOtpDto){
    try{


      const otp=body.otp
      const phoneNumber=body.phoneNumber

     

      let findedOtp=await this.redisService.get(`otp-${body.phoneNumber}`)
      
      
      
      findedOtp=JSON.parse(findedOtp)
      console.log(findedOtp);
      const date=new Date().getTime()
      if(!findedOtp){
        return {
          message: 'شماره تلفن پیدا نشد',
          statusCode: 400,
          error: 'شماره تلفن پیدا نشد'
        }
      }
      console.log("date",date-findedOtp.date);
      
      if((date-findedOtp.date)>120000){
        return {
          message: 'کد ورود منقضی شده است',
          statusCode: 400,
          error: 'کد ورود منقضی شده است'
        }
      }
      if(otp!=findedOtp.otp){
        return {
          message: 'کد ورود اشتباه است',
          statusCode: 400,
          error: 'کد ورود اشتباه است'
        }
      }

      const user = await this.userServiceL.checkOrCreate(phoneNumber)
      console.log('userrrrr', user)
      const token = await this.tokenize.tokenize({ _id: user?._id, phoneNumber: user?.phoneNumber }, "10m", 0)
      const refreshToken = await this.tokenize.tokenize({ _id: user?._id, phoneNumber: user?.phoneNumber }, "1h", 1)
      return {
        message: 'ارسال کد تایید موفق',
        statusCode: 200,
        data: { refreshToken: refreshToken, token: token, ...user?.toObject() }
      }
    }
    catch(error){
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
