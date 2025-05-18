import { Injectable, Req, Res } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { sendOtpDto } from './dto/sendOtpDto.dto';
import { RedisServiceService } from 'src/redis-service/redis-service.service';
import { UserService } from 'src/user/user.service';
import { TokenizeService } from 'src/tokenize/tokenize.service';
import { json } from 'stream/consumers';
import { validateOtpDto } from './dto/validateOtpDto.dto';

@Injectable()
export class AuthService {

  constructor(private redisService: RedisServiceService , private userServiceL:UserService,private tokenize:TokenizeService) {}

  private async otpGenerator() {
    return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
  }

  async sendOtp(@Req() req: any, @Res() res: any, body: sendOtpDto) {
    try {

      let { phoneNumber } = body;

      let otp = await this.otpGenerator()
      let data = { otp: otp, date: new Date().getTime() }
      
      await this.redisService.set(`otp-${phoneNumber}`,JSON.stringify(data))
      await this.redisService.set(`test-${phoneNumber}`,otp)

     const test= await this.redisService.get(`otp-${phoneNumber}`)
     console.log("testaccccccc",test);
     
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


      // return {
      //   message : 'login successfull',
      //   statuaCode : 200,
      //   data : {
      //     userStatus : 0
      //   }
      // }


      // console.log(body);

      // let findedOtp=await this.redisService.get(`otp-${body.phoneNumber}`)
      // const testCatch=await this.redisService.get(`test-${body.phoneNumber}`)
      
      
      // findedOtp=JSON.parse(findedOtp)
      // console.log(findedOtp);
      // const date=new Date().getTime()
      // if(!findedOtp){
      //   return {
      //     message: 'شماره تلفن پیدا نشد',
      //     statusCode: 400,
      //     error: 'شماره تلفن پیدا نشد'
      //   }
      // }
      // if((date-findedOtp.date)<120000){
      //   return {
      //     message: 'کد ورود منقضی شده است',
      //     statusCode: 400,
      //     error: 'کد ورود منقضی شده است'
      //   }
      // }
      // if(otp!=findedOtp.otp){
      //   return {
      //     message: 'کد ورود اشتباه است',
      //     statusCode: 400,
      //     error: 'کد ورود اشتباه است'
      //   }
      // }


          const user=await this.userServiceL.checkOrCreate(body.phoneNumber)

     
          const token = await this.tokenize.tokenize({_id:user?._id,phoneNumber:user?.phoneNumber},"10m",0)
          const refreshToken=await this.tokenize.tokenize({_id:user?._id,phoneNumber:user?.phoneNumber},"1h",1)
           return {
            message: 'ارسال کد تایید موفق',
            statusCode: 200,
            data: {refreshToken,token,user}
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
