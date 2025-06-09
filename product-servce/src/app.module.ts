import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';
import { InterserviceService } from './interservice/interservice.service';
import { CategoryModule } from './category/category.module';
import { Category,CategorySchema } from './category/entities/category.entity';
import {KafkaProducerService} from "../src/kafka/kafka.producer"
import { KafkaModule } from './kafka/kafka.module';
import { ProductModule } from './product/product.module';
import {RedisServiceService} from "./redis-service/redis-service.service"
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from 'configs/redis.config';
import { CartModule } from './cart/cart.module';

@Module({
  imports:  [
    ConfigModule.forRoot({isGlobal : true}),
    CacheModule.registerAsync(RedisOptions),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    CategoryModule,
    KafkaModule,
    ProductModule,
    CartModule
  ],
  controllers: [AppController],
  providers: [AppService,JwtService,InterserviceService,RedisServiceService],
})
export class AppModule {}
