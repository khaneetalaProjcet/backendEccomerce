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
import { log } from 'node:console';

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
    const admin = await this.adminModel
      .findOne({ phoneNumber })
      .select('+password');
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

  async getAdminAccess(adminId: string) {
    let admin: any = await this.adminModel
      .findById(adminId)
      .populate('accessPoint');

    console.log('1111', admin);
    if (!admin) {
      return {
        statusCode: 400,
        message: 'ادمین یافت نشد',
        error: 'ادمین یافت نشد',
      };
    }
    let allAccess = await this.pageModel.find();
    let access: any = [];

    console.log(admin.accessPoint, 'accesspoint is here ');

    let adminAccessToString: string[] = [];
    for (let i of admin.accessPoint) {
      console.log(i, 'i is here');

      adminAccessToString.push(i._id.toString());
    }

    console.log('after stringign >>>> ', adminAccessToString);

    // let deepCopyOfAdminAccess = admin.accessPoint ? JSON.parse(JSON.stringify(admin.accessPoint)) : []
    // console.log(deepCopyOfAdminAccess)
    for (let i of allAccess) {
      console.log(allAccess, 'all access is here');

      let data = JSON.parse(JSON.stringify(i.toObject()));

      console.log('dataid is >>>>', data._id);

      if (adminAccessToString.includes(data._id)) {
        console.log('its in', data._id);

        data['access'] = true;
        access.push(data);
      } else {
        console.log('its second ');
        data['access'] = false;
        access.push(data);
      }
    }
    return {
      message: 'سطح دسترسی',
      statusCode: 200,
      data: access,
    };
  }

  async updateAdminAccess(adminId: string, pageIds: string[]) {
    const isLocked = await this.lockerService.check(
      `admin-access:${adminId}`,
      5,
    );

    if (isLocked) {
      return {
        message: 'لطفاً چند لحظه دیگر تلاش کنید',
        statusCode: 400,
      };
    }

    try {
      const all = await this.pageModel
        .find({
          _id: { $in: pageIds },
        })
        .select('_id');

      const accessPointIds = all.map((item) => item._id);
      console.log('alllll', all);
      console.log('alllll', accessPointIds);
      const admin = await this.adminModel.findByIdAndUpdate(adminId, {
        accessPoint: accessPointIds,
      });

      if (!admin) {
        return {
          message: 'کاربر یافت نشد',
          statusCode: 404,
          error: 'کاربر با این شناسه یافت نشد',
        };
      }

      let updated = await this.adminModel.findById(adminId);
      console.log('updated', updated);
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
