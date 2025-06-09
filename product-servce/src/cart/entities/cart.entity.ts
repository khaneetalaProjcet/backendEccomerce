import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { count } from "console";
import mongoose from "mongoose";
import { ProductItems } from "src/product/entities/productItems.entity";



export interface CartInterface extends Document {
    user: string;

    products: {product : mongoose.Types.ObjectId , count : number}[]
    
    history: {product : mongoose.Types.ObjectId , count : number}[]
}




@Schema({timestamps:true})
export class Cart {

    @Prop({type : String})
    user:string

    @Prop({
        type: [{
            product: { type: mongoose.Schema.Types.ObjectId, ref: ProductItems.name },
            count: { type: Number }
        }]
    })
    products: { product: mongoose.Types.ObjectId, count: number }[]

    @Prop({
        type: [{
            product: { type: mongoose.Schema.Types.ObjectId, ref: ProductItems.name },
            count: { type: Number }
        }]
    })
    history: { product: mongoose.Types.ObjectId, count: number }[]

}



export const cartSchema = SchemaFactory.createForClass(Cart)