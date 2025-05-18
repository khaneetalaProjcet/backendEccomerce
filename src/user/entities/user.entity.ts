import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export type UserDocument = User & Document;
@Schema({timestamps:true})
export class User {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: string;

  @Prop({type:mongoose.Schema.Types.String})
  firstName: string;

  @Prop({type:mongoose.Schema.Types.String})
  lastName: string;

  @Prop({type:mongoose.Schema.Types.String, required: true, unique: true })
  phoneNumber: string;

  @Prop({type:mongoose.Schema.Types.String})
  email: string;

  @Prop({type:mongoose.Schema.Types.String})
  password: string;
 
  @Prop({type:mongoose.Schema.Types.String})
  pictureProfile: string;

  @Prop({type:mongoose.Schema.Types.String})
  nationalCode:string

  @Prop({type:mongoose.Schema.Types.Number})
  authStatus:number   //? 0 just init - 1 compelteProfile - 2 exist in old service

  @Prop({default:true})
  isActive: boolean;

}

export const UserSchema = SchemaFactory.createForClass(User);