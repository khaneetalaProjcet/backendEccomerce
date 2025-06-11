

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

    @Prop({ type: String })
    date: string

    @Prop({ type: String })
    time: string
}


export const goldInvoiceSchema = SchemaFactory.createForClass(goldInvoice)