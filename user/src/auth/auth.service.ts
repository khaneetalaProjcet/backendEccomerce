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
import { Cache } from 'cache-manager';
import { refreshTokenDto } from './dto/refreshTokenDto.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private redisService: RedisServiceService,
    private userServiceL: UserService,
    private tokenize: TokenizeService,
    @InjectModel('userM') private userModel: Model<UserDocument>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  private async otpGenerator() {
    return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  }

  async sendOtp(@Req() req: any, @Res() res: any, body: sendOtpDto) {
    try {
      let { phoneNumber } = body;

      let otp = await this.otpGenerator();
      let data = { otp: otp, date: new Date().getTime() };

      await this.redisService.setOtp(
        `otp-${phoneNumber}`,
        JSON.stringify(data),
      );

      return {
        message: 'ارسال کد تایید موفق',
        statusCode: 200,
        data: otp,
      };
    } catch (error) {
      console.log('error is sending otp', error);
      return {
        message: 'ارسال کد تایید ناموفق',
        statusCode: 500,
        error: 'خطای داخلی سیستم',
      };
    }
  }

  async validateOtp(body: validateOtpDto) {
    try {
      //  const array=await this.userModel.find()

      //  for (let index = 0; index < array.length; index++) {
      //   const element = array[index];
      //   await this.userModel.findByIdAndDelete(element._id)
      //  }

      const otp = body.otp;

      const phoneNumber = body.phoneNumber;

      let findedOtp = await this.redisService.get(`otp-${body.phoneNumber}`);

      findedOtp = JSON.parse(findedOtp);
      console.log(findedOtp);
      const date = new Date().getTime();
      if (!findedOtp) {
        return {
          message: 'شماره تلفن پیدا نشد',
          statusCode: 400,
          error: 'شماره تلفن پیدا نشد',
        };
      }
      console.log('date', date - findedOtp.date);

      if (date - findedOtp.date > 120000) {
        return {
          message: 'کد ورود منقضی شده است',
          statusCode: 400,
          error: 'کد ورود منقضی شده است',
        };
      }
      if (otp != findedOtp.otp) {
        return {
          message: 'کد ورود اشتباه است',
          statusCode: 400,
          error: 'کد ورود اشتباه است',
        };
      }

      const user = await this.userServiceL.checkOrCreate(phoneNumber);
      console.log('userrrrr', user);
      if (!user) {
        return {
          message: 'لطفا دوباره امتحان کنید',
          statusCode: 400,
          error: 'لطفا دوباره امتحان کنید',
        };
      }
      const token = await this.tokenize.tokenize(
        { _id: user?._id, phoneNumber: user?.phoneNumber },
        '1m',
        0,
      );
      const refreshToken = await this.tokenize.tokenize(
        { _id: user?._id, phoneNumber: user?.phoneNumber },
        '1m',
        1,
      );
      return {
        message: 'ارسال کد تایید موفق',
        statusCode: 200,
        data: { refreshToken: refreshToken, token: token, ...user?.toObject() },
      };
    } catch (error) {
      console.log('error is sending otp', error);
      return {
        message: 'مشکلی از سمت سرور به وجود آمده',
        statusCode: 500,
        error: 'خطای داخلی سیستم',
      };
    }
  }

  async refreshToken(refreshToken: refreshTokenDto) {
    try {
      const decoded = await this.tokenize.checkRefreshToken(
        refreshToken.refreshToken,
      );
      if (!decoded) {
        return {
          message: ' توکن منقضی شده است',
          statusCode: 401,
          error: ' توکن منقضی شده است',
        };
      }

      const token = await this.tokenize.tokenize(
        { _id: decoded?._id, phoneNumber: decoded?.phoneNumber },
        '1m',
        0,
      );

      return {
        message: 'ارسال کد تایید موفق',
        statusCode: 200,
        data: { token },
      };
    } catch (error) {
      console.log('error is sending otp', error);
      return {
        message: 'مشکلی از سمت سرور به وجود آمده',
        statusCode: 500,
        error: 'خطای داخلی سیستم',
      };
    }
  }

  async sendSetPasswordOtp(userId: string) {
    try {
      const user = await this.userModel.findById(userId);

      if (!user) {
        return {
          message: 'کاربر پیدا نشد',
          statusCode: 400,
          error: 'کاربر  پیدا نشد',
        };
      }

      let otp = await this.otpGenerator();
      let data = { otp: otp, date: new Date().getTime() };

      await this.redisService.setOtp(
        `otp-pass-${user.phoneNumber}`,
        JSON.stringify(data),
      );

      return {
        message: 'ارسال کد تایید موفق',
        statusCode: 200,
        data: otp,
      };
    } catch (error) {
      console.log('error is sending otp', error);
      return {
        message: 'ارسال کد تایید ناموفق',
        statusCode: 500,
        error: 'خطای داخلی سیستم',
      };
    }
  }

  async setpassword(userId: string, otp: number, password: string) {
    try {
      const user = await this.userModel.findById(userId);

      if (!user) {
        return {
          message: 'کاربر پیدا نشد',
          statusCode: 400,
          error: 'کاربر  پیدا نشد',
        };
      }

      let findedOtp = await this.redisService.get(
        `otp-pass-${user.phoneNumber}`,
      );

      findedOtp = JSON.parse(findedOtp);
      console.log(findedOtp);
      const date = new Date().getTime();
      if (!findedOtp) {
        return {
          message: 'شماره تلفن پیدا نشد',
          statusCode: 400,
          error: 'شماره تلفن پیدا نشد',
        };
      }
      console.log('date', date - findedOtp.date);

      if (date - findedOtp.date > 120000) {
        return {
          message: 'کد ورود منقضی شده است',
          statusCode: 400,
          error: 'کد ورود منقضی شده است',
        };
      }
      if (otp != findedOtp.otp) {
        return {
          message: 'کد ورود اشتباه است',
          statusCode: 400,
          error: 'کد ورود اشتباه است',
        };
      }

      const hashedPassword = await this.hashPassword(password);
      user.password = hashedPassword;
      await user.save();

      return {
        message: 'رمز عبور با موفقیت تغییر پیدا کرد',
        statusCode: 200,
        data: user,
      };
    } catch (error) {
      console.log('error', error);

      return {
        message: 'ارسال کد تایید ناموفق',
        statusCode: 500,
        error: 'خطای داخلی سیستم',
      };
    }
  }

  async loginWithPassword(phoneNumber: string, password: string) {
    try {
      const user = await this.userModel.findOne({ phoneNumber: phoneNumber });
      if (!user) {
        return {
          message: 'کاربر پیدا نشد',
          statusCode: 400,
          error: 'کاربر  پیدا نشد',
        };
      }

      const isMatch = this.comparePasswords(password, user.password);

      if (!isMatch) {
        return {
          message: 'رمز با شماره تلفن همخوانی ندارد',
          statusCode: 400,
          error: 'رمز با شماره تلفن همخوانی ندارد',
        };
      }
      const token = await this.tokenize.tokenize(
        { _id: user?._id, phoneNumber: user?.phoneNumber },
        '1m',
        0,
      );
      const refreshToken = await this.tokenize.tokenize(
        { _id: user?._id, phoneNumber: user?.phoneNumber },
        '1m',
        1,
      );
      return {
        message: 'ارسال کد تایید موفق',
        statusCode: 200,
        data: { refreshToken: refreshToken, token: token, ...user?.toObject() },
      };
    } catch (error) {
      console.log('error', error);

      return {
        message: 'ارسال کد تایید ناموفق',
        statusCode: 500,
        error: 'خطای داخلی سیستم',
      };
    }
  }

  async comparePasswords(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
