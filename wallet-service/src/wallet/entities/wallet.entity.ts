

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';



export interface UserDocument extends Document {

}



@Schema({timestamps:true})
export class wallet {
  
    @Prop({ type: String })
    owner: string

    @Prop({ type: Number })
    balance: number

    @Prop({ type: String })
    date : string
    
    @Prop({ type: String })
    time : string
    

    // @Prop({ type: String })
    // owner: string
    
    // @Prop({ type: String })
    // owner: string
    
    // @Prop({ type: String })
    // owner: string




}

export const walletSchema = SchemaFactory.createForClass(wallet);