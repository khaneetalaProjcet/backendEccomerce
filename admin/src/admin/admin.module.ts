import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './entities/admin.entity';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { Page, PageSchema } from 'src/page/entities/page.entity';
import { HttpModule } from '@nestjs/axios';
import { LocknewService } from 'src/locknew/locknew.service';
import { RedisServiceService } from 'src/redis-service/redis-service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Page.name, schema: PageSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtStrategy,LocknewService,RedisServiceService ],
})
export class AdminModule {}
