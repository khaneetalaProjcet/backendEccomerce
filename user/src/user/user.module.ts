import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {UserSchema2} from './entities/user.entity'
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[MongooseModule.forFeature([{ name: 'userM', schema: UserSchema2 }])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
