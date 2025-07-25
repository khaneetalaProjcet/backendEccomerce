

import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";


export interface goldInvoiceInterface extends Document {

    goldWeight: number

    orderId: string

    invoiceId: string

    wallet: mongoose.Types.ObjectId

    status: string

    date: string

    time: string

    state: number

}



@Schema({ timestamps: true })
export class goldInvoice {
    @Prop({ type: String })
    orderId: string

    @Prop({ type: Number })
    goldWeight: number

    @Prop({ type: String })
    invoiceId: string

    @Prop({ type: String })
    wallet: mongoose.Types.ObjectId

    @Prop({ type: String })
    status: string
    
    @Prop({ type: Number , default : 0 })
    state: number                // 0 : init   //1 : send to khanetala   2 : successFromKhaneetala   3 : send to product    4 : successFrom product    5 : failed from goldBox    6 : failedFrom product

    @Prop({ type: String })
    date: string

    @Prop({ type: String })
    time: string
}


export const goldInvoiceSchema = SchemaFactory.createForClass(goldInvoice)