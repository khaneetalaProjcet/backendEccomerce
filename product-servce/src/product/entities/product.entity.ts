import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


interface ProductItems {
    _id:string,
    size:string,
    weight:string,
    count:Number,

}

export interface ProductDocumnet extends Document {
  _id: string;
  name: string;
  items:[ProductItems],
  images:[string],
  description:string,
  wages:number
  category: Types.ObjectId
}

@Schema()
export class ProductItemSchemaClass {
  @Prop({ required: true })
  size: string;

  @Prop({ required: true })
  weight: string;

  @Prop({ required: true })
  count: number;
}

const ProductItemSchema = SchemaFactory.createForClass(ProductItemSchemaClass);



@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [ProductItemSchema], default: [], })
  items: ProductItems[];

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true })
  wages: number;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
