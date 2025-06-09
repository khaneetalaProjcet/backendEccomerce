import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


export interface ProductItemsDocment  extends Document{
    _id:string,
    size:string,
    weight:string,
    color:string,
    count:number,
}

@Schema()
export class ProductItems {

  @Prop()
  size: string;

  @Prop()
  weight: string;

  @Prop()
  color:string

  @Prop()
  count: number;
  
}


export  const ProductItemSchema = SchemaFactory.createForClass(ProductItems);