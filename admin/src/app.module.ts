import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { RedisOptions } from './config/redis.config';




@Module({
   imports : [
    ConfigModule.forRoot({isGlobal : true}),
    CacheModule.registerAsync(RedisOptions),
    MongooseModule.forRoot(process.env.MONGO_URI!),
   ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
