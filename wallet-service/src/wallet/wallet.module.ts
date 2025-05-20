import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { walletSchema } from './entities/wallet.entity';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI!),
  MongooseModule.forFeature([{name : 'wallet' , schema : walletSchema}]),

  ],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
