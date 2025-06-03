import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ProductItems } from './productItems.entity';

export interface ProductDocumnet extends Document {
  _id: string;
  name: string;
  items:[ProductItems],
  images:[string],
  description:string,
  wages:number
  category: Types.ObjectId
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [Types.ObjectId], ref: 'ProductItems', default: [] })
  items: Types.ObjectId[];

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
