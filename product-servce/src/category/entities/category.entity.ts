import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface CategoryDocumnet extends Document {
  _id: string;
  name: string;
  parent: string;
  children:[string]
}



@Schema({ timestamps: true })
export class Category  {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
  parent: Types.ObjectId;


  @Prop({default:""})
  description:string

  @Prop({ type: [Types.ObjectId], ref: 'Category', default: [] })
  children: Types.ObjectId[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
