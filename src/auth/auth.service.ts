import { Injectable, Req, Res } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { sendOtpDto } from './dto/sendOtpDto.dto';
import { RedisServiceService } from 'src/redis-service/redis-service.service';

@Injectable()
export class AuthService {

  constructor(private redisService: RedisServiceService) {

  }


  private async otpGenerator() {
    return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
  }

  async sendOtp(@Req() req: any, @Res() res: any, body: sendOtpDto) {
    try {

      let { phoneNumber } = body;

      let otp = await this.otpGenerator()
      let data = { otp: otp, date: new Date().getTime() }
      await this.redisService.set(`otp-${phoneNumber}`, data)
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
