import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from 'configs/redis.config';
import { RedisServiceService } from './redis-service/redis-service';
import { TokenizeService } from './tokenize/tokenize.service';
import { JwtService } from '@nestjs/jwt';
import { InterserviceService } from './interservice/interservice.service';
import { KafkaModule } from './kafka/kafka.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { Admin, AdminSchema } from './admin/entities/admin.entity';
import { PageModule } from './page/page.module';

import { LocknewService } from './locknew/locknew.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync(RedisOptions),
 MongooseModule.forRoot(process.env.MONGO_URI!),
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    // UserModule,
    // AuthModule,
    KafkaModule,
    AuthModule,
    AdminModule,
    PageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RedisServiceService,
    TokenizeService,
    InterserviceService,
    JwtService,
    LocknewService,
  ],
})
export class AppModule {}
