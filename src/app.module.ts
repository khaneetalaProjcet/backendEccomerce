import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
// import { HttpService } from './http/http.service';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from 'configs/redis.config';
import { RabbitMqService } from './rabbitmq/rabbitmq.service';
import { UserSchema } from './user/entities/user.entity';
import { RedisServiceService } from './redis-service/redis-service.service';
import { TokenizeService } from './tokenize/tokenize.service';
import { JwtService } from '@nestjs/jwt';



@Module({
  imports: [
    ConfigModule.forRoot({isGlobal : true}),
    CacheModule.registerAsync(RedisOptions),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    MongooseModule.forFeature([{name : 'user' , schema : UserSchema}]),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService , RabbitMqService, RedisServiceService, TokenizeService , JwtService],
})


export class AppModule {}
