import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminService } from 'src/admin/admin.service';
import { AdminModule } from 'src/admin/admin.module';
import { TokenizeService } from 'src/tokenize/tokenize.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'src/admin/entities/admin.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[AdminModule,MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }])],
  controllers: [AuthController],
  providers: [AuthService,AdminService,TokenizeService,JwtService],
})
export class AuthModule {}
