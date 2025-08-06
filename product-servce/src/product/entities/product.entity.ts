import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface ProductDocumnet extends Document {
  _id: string;
  name: string;
  items: any[];
  images: [{ name: string; src: string }];
  description: string;
  wages: number;
  count: number;
  mainImage: { name: string; src: string };
  firstCategory: Types.ObjectId;
  midCategory: Types.ObjectId;
  lastCategory: Types.ObjectId;
  suggestedProducts: any[];
  price: number;
  metaTitle: string;
  metaDescription: string;
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [Types.ObjectId], ref: 'ProductItems', required: true })
  items: Types.ObjectId[];

  @Prop({
    type: [{ name: { type: String }, src: { type: String } }],
    default: [{ name: '', src: '' }],
  })
  images: { name: string; src: string }[];

  @Prop({
    type: { name: { type: String }, src: { type: String } },
    default: {},
  })
  mainImage: { name: string; src: string };

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true })
  wages: number;

  @Prop({ default: 0 })
  count: number;

  @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
  firstCategory: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
  midCategory: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
  lastCategory: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Product', default: [] })
  suggestedProducts: Types.ObjectId[];

  @Prop({ type: Number, default: 0 })
  price: number;

  @Prop({ default: '' })
  metaDescription: string;

  @Prop({ default: '' })
  metaTitle: string;
}

// schema.pre('save', function(next) {
//   const err = new Error('something went wrong');
//   // If you call `next()` with an argument, that argument is assumed to be
//   // an error.
//   next(err);
// });

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.methods = {
  _calculateDiscount: async function () {},
};
