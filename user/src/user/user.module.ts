// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSchema2 } from './entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { InterserviceService } from '../interservice/interservice.service';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { JwtAdminStrategy } from 'src/jwt/admin-jwt.strategy';
// import { KafkaModule } from 'src/kafka/kafka.module'; // 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'userM', schema: UserSchema2 }]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    InterserviceService,
    JwtService,
    JwtStrategy,
    JwtAdminStrategy,
  ],
})
export class UserModule {}
