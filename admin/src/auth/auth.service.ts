import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AdminService } from 'src/admin/admin.service';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';
import { TokenizeService } from 'src/tokenize/tokenize.service';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from '../admin/entities/admin.entity';
import * as bcrypt from 'bcrypt';
import { UpdateAdminDto } from 'src/admin/dto/update-admin.dto';
import { log } from 'node:console';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly tokenize: TokenizeService,
  ) {}

  async registe(data: CreateAdminDto) {
    return this.adminService.register(data);
  }



async login(phoneNumber: string, password: string) {
  try {
    const admin = await this.adminService.findByPhoneNumber(phoneNumber)
    if (!admin || !admin.password) {
      return {
        message: 'کاربر پیدا نشد',
        statusCode: 400,
        error: 'کاربر پیدا نشد',
      };
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return {
        message: 'اطلاعات درست نمی‌باشد',
        statusCode: 400,
        error: 'اطلاعات درست نمی‌باشد',
      };
    }

    const token = await this.tokenize.tokenize(
      { _id: admin._id, phoneNumber: admin.phoneNumber },
      '1H',
      2,
    );

    const adminData = { ...admin.toObject(), token };

    return {
      message: 'خوش آمدید',
      statusCode: 200,
      data: adminData,
    };
  } catch (error) {
    console.log('Login error =>', error);
    return {
      message: 'مشکلی از سمت سرور به وجود آمده',
      statusCode: 500,
      error: 'خطای داخلی سیستم',
    };
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

  async update(id: string, updateAuthDto: UpdateAdminDto) {
    try {
    } catch (error) {}
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
