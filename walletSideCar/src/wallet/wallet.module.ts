import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { walletSchema } from './entities/wallet.entity';
import { WalletInvoice,WalletInvoiceSchema } from './entities/walletInvoice.entity';
import { goldInvoice, goldInvoiceSchema } from './entities/goldBoxInvoice.entity';
import { InterserviceService } from 'src/interservice/interservice.service';
import { PaymentService } from 'src/payment/payment.service';
import { AppService } from 'src/app.service';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI!),
   MongooseModule.forFeature([{name : 'wallet' , schema : walletSchema} , {name : goldInvoice.name , schema : goldInvoiceSchema} , {name : WalletInvoice.name , schema : WalletInvoiceSchema}]),

  ],
  controllers: [WalletController],
  providers: [WalletService,InterserviceService , PaymentService ,AppService],
})
export class WalletModule {}
