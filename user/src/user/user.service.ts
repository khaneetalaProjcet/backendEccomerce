import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from './entities/user.entity';
import { compelteRegisterDto } from './dto/completeRegister.dto';
import { InterserviceService } from '../interservice/interservice.service';
import mongoose, { Model, ClientSession, Types, SchemaTypes } from 'mongoose';
import { refreshTokenDto } from 'src/auth/dto/refreshTokenDto.dto';
import { upgradeProfileDto } from './dto/upgradeProfile.dto';
import { AddressDto } from './dto/addAdress.dto';
import { UpdateAddressDto } from './dto/updateAdress.sto';
import { IdentityDto } from 'src/user/dto/Identity.dto';
import { use } from 'passport';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('userM') private userModel: Model<UserDocument>,
    private readonly internalService: InterserviceService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async checkOrCreate(phoneNumber: string) {
    // const session: ClientSession = await this.userModel.db.startSession();
    // session.startTransaction();
    try {
      // const user = await this.userModel.findOne({ phoneNumber: phoneNumber }).session(session)
      const user = await this.userModel.findOne({ phoneNumber: phoneNumber });

      console.log('user after getting', user);
      if (!user) {
        const oldUser =
          await this.internalService.checkExistOldUser(phoneNumber);
        console.log(oldUser);

        if (oldUser.statusCode == 2) {
          return;
        }
        if (oldUser && oldUser.statusCode == 1) {
          console.log('oldUser', oldUser);

          // const oldNewUser = await this.userModel.create([{
          //   phoneNumber,
          //   firstName: oldUser.data.firstName,
          //   lastName: oldUser.data.lastName,
          //   fatherName: oldUser.data.fatherName,
          //   nationalCode:oldUser.data.nationalCode,
          //   birthDate:oldUser.data.birthDate,
          //   authStatus: 3,
          //   identityStatus : 1
          // }], { session })
          const oldNewUser = await this.userModel.create([
            {
              phoneNumber,
              firstName: oldUser.data.firstName,
              lastName: oldUser.data.lastName,
              fatherName: oldUser.data.fatherName,
              nationalCode: oldUser.data.nationalCode,
              birthDate: oldUser.data.birthDate,
              authStatus: 3,
              identityStatus: 1,
            },
          ]);

          const wallet = {
            owner: oldNewUser[0]._id,
            balance: 0,
            goldWeight: oldUser.data.goldWeight,
          };
          console.log('what is the fucking this >>>> ', oldNewUser);
          let a = await this.internalService.createWallet(wallet);
          console.log('after request to wallet , ', a);
          // await session.commitTransaction();
          return oldNewUser[0];
        } else if (oldUser.statusCode == 0) {
          // let newUser = await this.userModel.create([{ phoneNumber: phoneNumber, authStatus: 1, identityStatus:0 }], { session })
          let newUser = await this.userModel.create([
            { phoneNumber: phoneNumber, authStatus: 1, identityStatus: 0 },
          ]);

          // await session.commitTransaction();
          return newUser[0];
        }
      }
      // await session.commitTransaction();
      return user;
    } catch (error) {
      console.log(error);
      // await session.abortTransaction();
      // return {
      //   message: 'مشکلی از سمت سرور به وجود آمده',
      //   statusCode: 500,
      //   error: 'خطای داخلی سیستم'
      // }
    }
    // finally {
    //   session.endSession();
    // }
  }

  async completeRegister(userId: string, data: compelteRegisterDto) {
    // const session: ClientSession = await this.userModel.db.startSession();
    // session.startTransaction();
    try {
      console.log(userId);

      // const user = await this.userModel.findByIdAndUpdate(userId, {
      //   firstName: data.firstName,
      //   lastName: data.lastName,
      //   fatherName: data.fatherName,
      //   adresses: data.adresses,
      //   email: data.email,
      //   authStatus: 2
      // }).session(session)

      const user = await this.userModel.findByIdAndUpdate(userId, {
        firstName: data.firstName,
        lastName: data.lastName,
        fatherName: data.fatherName,
        adresses: data.adresses,
        email: data.email,
        authStatus: 2,
      });

      console.log(user);

      if (!user) {
        return {
          message: 'کاربر پیدا نشد',
          statusCode: 400,
          error: 'کاربر پیدا نشد',
        };
      }

      const wallet = {
        owner: user._id,
        balance: 0,
        goldWeight: '0',
      };

      await this.internalService.createWallet(wallet);
      // await session.commitTransaction();
      return {
        message: 'ثبت نام شما کامل شد',
        statusCode: 200,
        data: user,
      };
    } catch (error) {
      console.log('error', error);
      // await session.abortTransaction();
      return {
        message: 'مشکلی از سمت سرور به وجود آمده',
        statusCode: 500,
        error: 'خطای داخلی سیستم',
      };
    }
    // finally {
    //   session.endSession();
    // }
  }

  async identity(userId: string, data: IdentityDto) {
    // const session: ClientSession = await this.userModel.db.startSession();
    // session.startTransaction();
    try {
      // const user=await this.userModel.findByIdAndUpdate(userId,{
      //   birthDate:data.birthDate,
      //   nationalCode:data.nationalCode,
      //   // phoneNumber:data.phoneNumber,
      //   authStatus:2,
      //   identityStatus:2
      // }).session(session)

      const user = await this.userModel.findByIdAndUpdate(userId, {
        birthDate: data.birthDate,
        nationalCode: data.nationalCode,
        // phoneNumber:data.phoneNumber,
        authStatus: 2,
        identityStatus: 2,
      });

      if (!user) {
        return {
          message: 'کاربر پیدا نشد',
          statusCode: 400,
          error: 'کاربر پیدا نشد',
        };
      }

      // await session.commitTransaction();

      return {
        message: '',
        statusCode: 200,
        data: user,
      };
    } catch (error) {
      console.log('error', error);

      //  await session.abortTransaction();
      return {
        message: 'مشکلی از سمت سرور به وجود آمده',
        statusCode: 500,
        error: 'خطای داخلی سیستم',
      };
    }
    // finally{
    //   // session.endSession();
    // }
  }

  async onModuleInit() {
    await this.kafkaClient.connect();

    // await this.getAllUser();
  }

  async getAllUser() {
    try {
      const users = await this.userModel.find();
      // this.kafkaClient.emit('user', users);
      return {
        message: '',
        statusCode: 200,
        data: users,
      };
    } catch (error) {
      console.log('error', error);
      return {
        message: 'مشکلی از سمت سرور به وجود آمده',
        statusCode: 500,
        error: 'خطای داخلی سیستم',
      };
    }
  }

  async getUsersProvinces() {
    try {
      const array = [] as { name: string; value: number }[];

      const users = await this.userModel.find();

      for (const user of users) {
        for (const addr of user.adresses) {
          const province = addr.province?.trim();
          if (!province) continue;

          const checkForExistingProvince = array.find(
            (item) => item.name === province,
          );  

          if (checkForExistingProvince) {
            checkForExistingProvince.value += 1;
          } else {
            array.push({ name: province, value: 1 });
          }
        }
      }

      return {
        data: array,
        message: 'تعداد کاربران بر اساس استان',
        statusCode: 200,
      };
    } catch (error) {
      console.log('errrrr', error);
      return {
        data: null,
        message: 'خطا در دریافت اطلاعات',
        statusCode: 500,
      };
    }
  }

  async upgradeProfile(userId: string, data: upgradeProfileDto) {
    // const session: ClientSession = await this.userModel.db.startSession();
    // session.startTransaction();
    try {
      console.log(userId);

      // const user = await this.userModel.findByIdAndUpdate(userId, {
      //  phoneNumber:data.phoneNumber,
      //  birthDate:data.birthDate,
      //  nationalCode:data.nationalCode,
      //  identityStatus:2
      // }).session(session)
      const user = await this.userModel.findByIdAndUpdate(userId, {
        phoneNumber: data.phoneNumber,
        birthDate: data.birthDate,
        nationalCode: data.nationalCode,
        identityStatus: 2,
      });

      console.log(user);

      if (!user) {
        return {
          message: 'کاربر پیدا نشد',
          statusCode: 400,
          error: 'کاربر پیدا نشد',
        };
      }
      // await session.commitTransaction();
      return {
        message: 'ثبت نام شما کامل شد',
        statusCode: 200,
        data: user,
      };
    } catch (error) {
      console.log('error', error);
      // await session.abortTransaction();
      return {
        message: 'مشکلی از سمت سرور به وجود آمده',
        statusCode: 500,
        error: 'خطای داخلی سیستم',
      };
    }
    //  finally {
    //   session.endSession();
    // }
  }

  async addAddress(userId: string, data: AddressDto) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $push: { adresses: data } },
      { new: true },
    );
    if (!user) {
      return {
        message: 'کاربر پیدا نشد',
        statusCode: 400,
        error: 'کاربر پیدا نشد',
      };
    }
    return {
      message: '',
      statusCode: 200,
      data: user.adresses,
    };
  }

  async getAddresses(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      return {
        message: 'کاربر پیدا نشد',
        statusCode: 400,
        error: 'کاربر پیدا نشد',
      };
    }
    return {
      message: '',
      statusCode: 200,
      data: user.adresses,
    };
  }

  async getSpecificAddress(req: any, res: any, adressId: string) {
    let userId = req.user.userId;
    let address = await this.userModel.findById(userId);

    if (!address) {
      return {
        message: 'آدرس مورد نظر یافت نشد',
        statusCode: 400,
        error: 'آدرس مورد نظر یافت نشد',
      };
    }

    let list;
    for (let i of address.adresses) {
      if (i._id == adressId) {
        list = i;
      }
    }
    console.log('address is >>>', address?.adresses);
    return {
      message: 'موفق',
      statusCode: 200,
      data: list,
    };
  }

  async updateAddress(userId: string, data: UpdateAddressDto) {
    // const user = await this.userModel.findOneAndUpdate(
    //   { _id: userId, 'addresses._id': data.adressId },
    //   {
    //     $set: {
    //       'addresses.$.adress': data.adress,
    //       'addresses.$.postCode': data.postCode,
    //       'addresses.$.plate': data.plate,
    //       'addresses.$.unit': data.unit,
    //     },
    //   },
    //   { new: true },
    // );
    const user = await this.userModel.findById(userId);
    if (!user) {
      return {
        message: 'کاربر پیدا نشد',
        statusCode: 400,
        error: 'کاربر پیدا نشد',
      };
    }
    const index = user.adresses.findIndex((i) => i._id == data.adressId);

    if (index == -1) {
      return {
        message: 'کاربر پیدا نشد',
        statusCode: 400,
        error: 'کاربر پیدا نشد',
      };
    }

    console.log('findedAdress', user.adresses[index]);

    user.adresses[index].adress = data.adress;
    user.adresses[index].name = data.name;
    user.adresses[index].plate = data.plate;
    user.adresses[index].postCode = data.postCode;
    user.adresses[index].unit = data.unit;

    await user.save();

    return {
      message: '',
      statusCode: 200,
      data: user.adresses,
    };
  }

  async deleteAddress(userId: string, adressId: string) {
    console.log('its here for delete address >>>> ', adressId, userId);
    const user = await this.userModel.findById(userId);

    if (!user) {
      return {
        message: 'کاربر پیدا نشد',
        statusCode: 400,
        error: 'کاربر پیدا نشد',
      };
    }

    console.log('addressesss >>>> ', user.adresses);

    let list: any = [];
    for (let i of user.adresses) {
      if (i._id != adressId) {
        list.push(i);
      }
    }

    await user.updateOne({ adresses: list });

    let updated = await this.userModel.findById(userId);

    console.log('addressesss >>>> ', updated?.adresses);
    // await user.save();
    return {
      message: '',
      statusCode: 200,
      data: updated?.adresses,
    };
  }

  async changeStatus(userId: string, identityStatus: number) {
    const user = await this.userModel.findByIdAndUpdate(userId, {
      identityStatus,
    });

    if (!user) {
      return {
        message: 'کاربر پیدا نشد',
        statusCode: 400,
        error: 'کاربر پیدا نشد',
      };
    }
    return {
      message: '',
      statusCode: 200,
      data: user,
    };
  }

  async deletAll() {
    await this.userModel.deleteMany();
    return {
      message: 'ok',
      statusCode: 200,
    };
  }

  async findById(userId: string) {
    // const session: ClientSession = await this.userModel.db.startSession();
    // session.startTransaction();
    try {
      const user = await this.userModel.findById(userId);
      // const user = await this.userModel.findById(userId).session(session)
      if (!user) {
        return {
          message: 'کاربر پیدا نشد',
          statusCode: 400,
          error: 'کاربر پیدا نشد',
        };
      }
      // await session.commitTransaction();
      return {
        message: 'ثبت نام شما کامل شد',
        statusCode: 200,
        data: user,
      };
    } catch (error) {
      console.log('error', error);
      // await session.abortTransaction();
      return {
        message: 'مشکلی از سمت سرور به وجود آمده',
        statusCode: 500,
        error: 'خطای داخلی سیستم',
      };
    } finally {
      console.log('its here for commig');
      // session.endSession();
    }
  }



  async findByIdByAdmin(userId: string) {
    // const session: ClientSession = await this.userModel.db.startSession();
    // session.startTransaction();
    try {
      const user = await this.userModel.findById(userId);
      // const user = await this.userModel.findById(userId).session(session)
      if (!user) {
        return {
          message: 'کاربر پیدا نشد',
          statusCode: 400,
          error: 'کاربر پیدا نشد',
        };
      }
      // await session.commitTransaction();
      return {
        message: 'ثبت نام شما کامل شد',
        statusCode: 200,
        data: user,
      };
    } catch (error) {
      console.log('error', error);
      // await session.abortTransaction();
      return {
        message: 'مشکلی از سمت سرور به وجود آمده',
        statusCode: 500,
        error: 'خطای داخلی سیستم',
      };
    } finally {
      console.log('its here for commig');
      // session.endSession();
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

  async activation(userId: string) {
    try {
      const user = await this.userModel.findById(userId);
      console.log(user, 'user is heer');
      console.log(userId, 'userId is heer');
      console.log(typeof userId, 'user is heereeeeeeeeeee');

      if (!user) {
        return {
          message: 'کاربر پیدا نشد',
          statusCode: 400,
          error: 'کاربر پیدا نشد',
        };
      }

      if (user.isActive) {
        await user.updateOne({ isActive: false });
      } else {
        await user.updateOne({ isActive: true });
      }

      const updatedUser = await this.userModel.findById(userId);

      return {
        message: 'done',
        statusCode: 200,
        data: updatedUser,
      };
    } catch (error) {
      console.log('error', error);
      return {
        message: 'مشکلی از سمت سرور به وجود آمده',
        statusCode: 500,
        error: 'خطای داخلی سیستم',
      };
    }
  }
}
