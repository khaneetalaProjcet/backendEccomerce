import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { walletSchema } from './entities/wallet.entity';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { walletInvoice, walletInvoiceSchema } from './entities/walletInvoice.entity';
import { goldInvoice, goldInvoiceSchema } from './entities/goldBoxInvoice.entity';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI!),
   MongooseModule.forFeature([{name : 'wallet' , schema : walletSchema} , {name : goldInvoice.name , schema : goldInvoiceSchema} , {name : walletInvoice.name , schema : walletInvoiceSchema}]),

  ],
  controllers: [WalletController],
  providers: [WalletService,JwtStrategy],
})
export class WalletModule {}
