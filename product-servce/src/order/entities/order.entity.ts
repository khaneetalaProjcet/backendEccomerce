
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Product } from "src/product/entities/product.entity";
import { ProductItems } from "src/product/entities/productItems.entity";

export interface OrderInterface extends Document {

    _id: mongoose.Types.ObjectId

    user: string;

    products: { product: mongoose.Types.ObjectId, mainProduct: mongoose.Types.ObjectId, count: number }[]

    date: string

    time: string

    invoiceId: string

    paymentMethod: number

    totalPrice: number

    status: number,

    goldBox: string

    goldBoxPay: number

    cashPay: number

    address: {
        addressId: string,
        adress: string,
        postCode: string,
        name: string,
        plate: number,
        unit: number
    }

    goldBoxInvoiceId: string

    cashInvoiceId : string

}

@Schema({ timestamps: true })
export class Order {

    @Prop({ type: String })
    user: string

    @Prop({
        type: [{
            product: { type: mongoose.Schema.Types.ObjectId, ref: ProductItems.name },
            mainProduct: { type: mongoose.Schema.Types.ObjectId, ref: Product.name },
            count: { type: Number }
        }]
    })
    products: { product: mongoose.Types.ObjectId, mainProduct: mongoose.Types.ObjectId, count: number }[]

    @Prop({ type: Number, default: 0 })
    totalPrice: number

    @Prop({ type: String, default: "0" })
    goldBox: string

    @Prop({ type: String })
    time: string

    @Prop({ type: String })
    date: string

    @Prop({ type: String })
    invoiceId: string

    @Prop({
        type: {
            addressId: { type: String },
            adress: { type: String },
            postCode: { type: String },
            name: { type: String },
            plate: { type: Number },
            unit: { type: Number }
        }
    })
    address: {
        addressId: string,
        adress: string,
        postCode: string,
        name: string,
        plate: number,
        unit: number
    }

    @Prop({ type: Number, required: false, default: 1 })
    paymentMethod: number

    @Prop({ type: Number, default: 2 })
    status: number    //? 0 init //? 1 success //2 pending for pay  //3 : approvePay  // 4 : recieved   // 5 failed

    @Prop({ type: Number, required: false })
    goldPrice: number

    @Prop({ type: Number, required: true , default : 0 })
    goldBoxPay: number
    
    @Prop({ type: Number, required: true , default : 0 })
    cashPay: number

    @Prop({ type: String , default : '' })
    goldBoxInvoiceId: string

    @Prop({ type: String , default : ''})
    cashInvoiceId: string
    
}



export const orderSchema = SchemaFactory.createForClass(Order)