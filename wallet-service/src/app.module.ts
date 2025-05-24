import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtService } from './jwt/jwt.service';
import { RedisServiceService } from './redis-service/redis-service.service';
import { WalletModule } from './wallet/wallet.module';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { RedisOptions } from 'configs/redis.config';
import { RabbitMqService } from './rabbit-mq/rabbit-mq.service';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal : true}),
    CacheModule.registerAsync(RedisOptions),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    WalletModule
    // MongooseModule.forFeature([{name : 'wallet' , schema : }]),
    ],
    
  controllers: [AppController],
  providers: [AppService, AuthService, JwtService, RedisServiceService, RabbitMqService],
})


export class AppModule {}
