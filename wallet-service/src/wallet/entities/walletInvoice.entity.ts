import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";


export interface walletInvoiceInterface extends Document {

    amount: number

    authority : string

    orderId: string

    invoiceId: string

    wallet: mongoose.Types.ObjectId

    status: string

    date: string

    time: string

    paymentDetail : {}

    walletInvoice: mongoose.Types.ObjectId

    state : number        // 0 : init     // 1 : in the gatewya      // 2 : send to product    // 3 : success from product

}


@Schema({ timestamps: true })
export class walletInvoice {
    @Prop({ type: String })
    orderId: string

    @Prop({type : String , default : ''})
    authority:string

    @Prop({ type: Number })
    amount: number

    @Prop({ type: String })
    invoiceId: string

    @Prop({ type: String })
    wallet: mongoose.Types.ObjectId

    @Prop({ type: String , default : null })
    walletInvoice: mongoose.Types.ObjectId

    @Prop({ type: String })
    status: string

    @Prop({ type: String })
    date: string

    @Prop({ type: String })
    time: string

    @Prop({type : {}})
    paymentDetail : {}


    @Prop({type : Number , default : 0})
    state : number


}

export const walletInvoiceSchema = SchemaFactory.createForClass(walletInvoice)