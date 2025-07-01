import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Admin, AdminDocument } from './entities/admin.entity';
import * as bcrypt from 'bcrypt';
import { Page, pageDocument } from 'src/page/entities/page.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { CreateLogDto } from './dto/createLog.dto';
import { LocknewService } from 'src/locknew/locknew.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(Page.name) private pageModel: Model<pageDocument>,
    private readonly httpService: HttpService,
    private readonly lockerService: LocknewService,
  ) {}

  async register(dto: CreateAdminDto) {
    try {
      const existing = await this.adminModel.findOne({
        phoneNumber: dto.phoneNumber,
      });
      if (existing) {
        return {
          message: 'کاربر وجود دارد',
          statusCode: 400,
          error: 'کاربر وجود دارد',
        };
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const admin = new this.adminModel({
        ...dto,
        password: hashedPassword,
      });

      await admin.save();

      await this.sendLog({
        level: 'info',
        serviceName: 'AdminService',
        message: 'ثبت‌نام ادمین موفق بود',
        firstName: dto.firstName,
        lastName: dto.lastName,
        timestamp: new Date().toISOString(),
        role: 'admin',
      });

      return {
        message: 'ثبت نام شما کامل شد',
        statusCode: 200,
        data: admin,
      };
    } catch (error) {
      console.log('error is sending otp', error);
      await this.sendLog({
        level: 'error',
        serviceName: 'AdminService',
        message: 'خطا در ثبت‌نام',
        firstName: dto.firstName,
        lastName: dto.lastName,
        timestamp: new Date().toISOString(),
        role: 'admin',
      });

      return {
        message: 'مشکلی از سمت سرور به وجود آمده',
        statusCode: 500,
        error: 'خطای داخلی سیستم',
      };
    }
  }

  async findByPhoneNumber(phoneNumber: string) {
    const admin = await this.adminModel.findOne({ phoneNumber });
    if (!admin) {
      return null;
    }
    return admin;
  }

  async findById(id: string) {
    const admin = await this.adminModel.findById(id);
    if (!admin) {
      return {
        message: 'کاربر وجود ندارد',
        statusCode: 400,
        error: 'کاربر وجود ندارد',
      };
    }
    return {
      message: 'کاربر یافت شد',
      statusCode: 200,
      data: admin,
    };
  }

  async findAll() {
    try {
      const admins = await this.adminModel.find();

      return {
        message: '',
        statusCode: 200,
        data: admins,
      };
    } catch (error) {
      return {
        message: 'خطا در دریافت کاربر',
        statusCode: 500,
        error: error.message,
      };
    }
  }

  async findOne(id: string) {
    try {
      const admin = await this.adminModel.findById(id);
      if (!admin) {
        return {
          message: 'کاربر وجود ندارد',
          statusCode: 400,
          error: 'کاربر وجود ندارد',
        };
      }

      await this.sendLog({
        level: 'warn',
        serviceName: 'AdminService',
        message: 'کاربر تکراری بود',
        firstName: admin.firstName,
        lastName: admin.lastName,
        timestamp: new Date().toISOString(),
        role: 'admin',
      });

      return {
        message: 'کاربر یافت شد',
        statusCode: 200,
        data: admin,
      };
    } catch (error) {
      return {
        message: 'خطا در دریافت کاربر',
        statusCode: 500,
        error: error.message,
      };
    }
  }

  async updateAdminAccess(adminId: string, pageIds: string[]) {
    const isLocked = await this.lockerService.check(
      `admin-access:${adminId}`,
      5,
    );

    if (isLocked) {
      return {
        message: 'lotfan chand lahze digar talash konid',
        statusCode: 400,
      };
    }

    try {
      const all = await this.pageModel
        .find({
          _id: { $in: pageIds },
        })
        .select('_id');

      const admin = await this.adminModel.findByIdAndUpdate(adminId, {
        accessPoint: all,
      });

      if (!admin) {
        return {
          message: 'کاربر یافت نشد',
          statusCode: 404,
          error: 'کاربر با این شناسه یافت نشد',
        };
      }

      await this.lockerService.disablor(`admin-access${adminId}`);

      return {
        message: 'دسترسی‌های ادمین بروزرسانی شد',
        statusCode: 200,
        data: all,
      };
    } catch (error) {
      return {
        message: 'خطا در بروزرسانی دسترسی‌های ادمین',
        statusCode: 500,
        error: error.message,
      };
    }
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    const isLocked = await this.lockerService.check(`admin-update:${id}`, 5);

    if (isLocked) {
      return {
        message: 'chand lahze digar talash konid ',
        statusCode: 400,
      };
    }

    try {
      const admin = await this.adminModel.findByIdAndUpdate(id, updateAdminDto);

      if (!admin) {
        return {
          message: 'کاربر وجود ندارد',
          statusCode: 400,
          error: 'کاربر وجود ندارد',
        };
      }
      await this.sendLog({
        level: 'info',
        serviceName: 'AdminService',
        firstName: updateAdminDto.firstName,
        lastName: updateAdminDto.lastName,
        message: 'کاربر بروزرسانی شد',
        timestamp: new Date().toISOString(),
        role: 'admin',
      });

      await this.lockerService.disablor(`admin-access${id}`);

      return {
        message: 'کاربر بروزرسانی شد',
        statusCode: 200,
        data: admin,
      };
    } catch (error) {
      return {
        message: 'خطا در بروزرسانی کاربر',
        statusCode: 500,
        error: error.message,
      };
    }
  }

  async remove(id: string) {
    const isLocked = await this.lockerService.check(`admin-remove:${id}`, 5);

    if (isLocked) {
      return {
        message: 'چند لحظه دیگر تلاش کنید',
        statusCode: 400,
      };
    }

    try {
      const admin = await this.adminModel.findByIdAndDelete(id);

      if (!admin) {
        return {
          message: 'کاربر یافت نشد',
          statusCode: 404,
          error: 'کاربر با این شناسه یافت نشد',
        };
      }

      await this.sendLog({
        level: 'info',
        serviceName: 'AdminService',
        firstName: admin.firstName,
        lastName: admin.lastName,
        message: 'کاربر حذف شد',
        timestamp: new Date().toISOString(),
        role: 'admin',
      });

      await this.lockerService.disablor(`admin-access${id}`);

      return {
        message: 'کاربر با موفقیت حذف شد',
        statusCode: 200,
        data: admin,
      };
    } catch (error) {
      return {
        message: 'خطا در حذف کاربر',
        statusCode: 500,
        error: error.message,
      };
    }
  }

  private async sendLog(createLogDto: CreateLogDto) {
    const url = 'http://localhost:3000/logs/admin';
    try {
      await lastValueFrom(this.httpService.post(url, createLogDto));
    } catch (error) {
      console.error('Error sending log:', error.message);
    }
  }
}
