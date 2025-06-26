import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export interface AdminDocument extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  pictureProfile: string;
  isActive: boolean;
}

@Schema({ timestamps: true })
export class Admin {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: string;

  @Prop({ type: mongoose.Schema.Types.String })
  firstName: string;

  @Prop({ type: mongoose.Schema.Types.String })
  lastName: string;

  @Prop({ type: mongoose.Schema.Types.String, required: true })
  phoneNumber: string;

  @Prop({ type: mongoose.Schema.Types.String })
  email: string;

  @Prop({ type: mongoose.Schema.Types.String })
  fatherName: string;

  @Prop({ type: mongoose.Schema.Types.String })
  password: string;

  @Prop({ type: mongoose.Schema.Types.String, default: '' })
  pictureProfile: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'page' })
  accessPoint: mongoose.Types.ObjectId[];
 
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
