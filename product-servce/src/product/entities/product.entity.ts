import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ProductItems } from './productItems.entity';

export interface ProductDocumnet extends Document {
  _id: string;
  name: string;
  items:[any],
  images:[string],
  description:string,
  wages:number,
  count:number,
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
  mainImage: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true })
  wages: number;

  @Prop({ default:0 })
  count: number;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  firstCategory: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  midCategory: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  lastCategory: Types.ObjectId;

  


}

export const ProductSchema = SchemaFactory.createForClass(Product);
