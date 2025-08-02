import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisServiceService } from './redis-service/redis-service.service';
import { WalletModule } from './wallet/wallet.module';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { RedisOptions } from 'configs/redis.config';
import { KafkaService } from './kafka/kafka.service';
import { InterserviceService } from './interservice/interservice.service';
import { PaymentService } from './payment/payment.service';
import {
  goldInvoice,
  goldInvoiceSchema,
} from './wallet/entities/goldBoxInvoice.entity';
import {
  WalletInvoice,
  WalletInvoiceSchema,
} from './wallet/entities/walletInvoice.entity';
import { wallet, walletSchema } from './wallet/entities/wallet.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { CrobJobService } from './crob-job/crob-job.service';
import { KafkaProducerService } from './kafka/kafka.poducer';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync(RedisOptions),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    WalletModule,
    MongooseModule.forFeature([
      { name: goldInvoice.name, schema: goldInvoiceSchema },
      { name: wallet.name, schema: walletSchema },
      { name: WalletInvoice.name, schema: WalletInvoiceSchema },
    ]),
    KafkaModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    RedisServiceService,
    JwtService,
    KafkaService,
    InterserviceService,
    PaymentService,
    CrobJobService,
  ],
})
export class AppModule {}
