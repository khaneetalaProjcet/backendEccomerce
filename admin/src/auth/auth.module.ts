import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminService } from 'src/admin/admin.service';
import { AdminModule } from 'src/admin/admin.module';
import { TokenizeService } from 'src/tokenize/tokenize.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'src/admin/entities/admin.entity';
import { JwtService } from '@nestjs/jwt';
import { Page, PageSchema } from 'src/page/entities/page.entity';
import { LocknewService } from 'src/locknew/locknew.service';
import { HttpModule } from '@nestjs/axios';
import { RedisServiceService } from 'src/redis-service/redis-service';

@Module({
  imports: [
    AdminModule,
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Page.name, schema: PageSchema },
    ]),
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AdminService, TokenizeService, JwtService,LocknewService,RedisServiceService],
})
export class AuthModule {}
