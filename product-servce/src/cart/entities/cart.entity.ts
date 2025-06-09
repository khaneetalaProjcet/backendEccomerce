import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { ProductItems } from "src/product/entities/productItems.entity";



export interface CartInterface extends Document {
    user: string;

    products: mongoose.Types.ObjectId[]
    
    history: mongoose.Types.ObjectId[]
}




@Schema({timestamps:true})
export class Cart {

    @Prop({type : String})
    user:string

    @Prop({type : [mongoose.Schema.Types.ObjectId] , ref : ProductItems.name})
    products : mongoose.Types.ObjectId[]

    @Prop({type : [mongoose.Schema.Types.ObjectId] , ref : ProductItems.name})
    history : mongoose.Types.ObjectId[]

}



export const cartSchema = SchemaFactory.createForClass(Cart)