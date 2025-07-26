import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';



export interface pageDocument extends Document {
  _id: string;
  persianName: string;
  englishName: string;
}


@Schema({ timestamps: true })
export class Page {
 
  @Prop({ type: mongoose.Schema.Types.String })
  persianName: string;

  @Prop({ type: mongoose.Schema.Types.String })
  englishName: string;

}

export const PageSchema = SchemaFactory.createForClass(Page);
