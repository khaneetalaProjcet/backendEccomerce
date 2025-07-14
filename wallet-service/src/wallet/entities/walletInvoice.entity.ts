import { Document, Types } from 'mongoose';

export interface WalletInvoiceInterface extends Document {
  orderId: string;
  amount: number;
  token: string;
  ResNum?: string;
  rrn?: string;
  traceNo?: string;
  affectiveAmount?: number;
  status: string;
  state: number;
  terminalId?: string;
  wallet: Types.ObjectId;
  paymentDetail: Record<string, any>;
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class WalletInvoice {
  @Prop({ type: String, required: true })
  orderId: string;

  @Prop({ type: Number, required: true })
  amount: number;
  
  @Prop({ type: String, required: true })
  token: string;

  @Prop({ type: String, default: '' })
  ResNum: string;

  @Prop({ type: String, default: '' })
  rrn: string;

  @Prop({ type: String, default: '' })
  traceNo: string;

  @Prop({ type: Number, default: 0 })
  affectiveAmount: number;

  @Prop({ type: String, default: 'pending' })
  status: string;

  @Prop({ type: Number, default: 0 })
  state: number;

  // @Prop({ type: String, default: '' })
  // terminalId: string;

  @Prop({ type: Types.ObjectId, ref: 'Wallet', required: true })
  wallet: Types.ObjectId;

  @Prop({ type: Object, default: {} })
  paymentDetail: Record<string, any>;
}

export const WalletInvoiceSchema = SchemaFactory.createForClass(WalletInvoice);



// export interface walletInvoiceInterface extends Document {
//   amount: number;

//   authority: string;

//   orderId: string;

//   invoiceId: string;

//   wallet: mongoose.Types.ObjectId;

//   status: string;

//   date: string;

//   time: string;

//   paymentDetail: any;

//   walletInvoice: mongoose.Types.ObjectId;

//   state: number; // 0 : init, 1 : in the gateway, 2 : send to product, 3 : success from product

//   token: string;

//   rrn: string;

//   traceNo: string;

//   terminalId: string;

//   affectiveAmount: number;
// }

// @Schema({ timestamps: true })
// export class walletInvoice {
//   @Prop({ type: String })
//   orderId: string;

//   @Prop({ type: String, default: '' })
//   authority: string;

//   @Prop({ type: Number })
//   amount: number;

//   @Prop({ type: String })
//   invoiceId: string;

//   @Prop({ type: String })
//   wallet: mongoose.Types.ObjectId;

//   @Prop({ type: String, default: null })
//   walletInvoice: mongoose.Types.ObjectId;

//   @Prop({ type: String })
//   status: string;

//   @Prop({ type: String })
//   date: string;

//   @Prop({ type: String })
//   time: string;

//   @Prop({ type: {}, default: {} })
//   paymentDetail: {};

//   @Prop({ type: Number, default: 0 })
//   state: number;

//   @Prop({ type: String })
//   token: string;

//   @Prop({ type: String })
//   rrn: string;

//   @Prop({ type: String })
//   traceNo: string;

//   @Prop({ type: String })
//   terminalId: string;

// }

// export const walletInvoiceSchema = SchemaFactory.createForClass(walletInvoice)
