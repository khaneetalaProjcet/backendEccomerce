

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';



export interface walletDocument extends Document {
    owner: string

    balance: number

    goldWeight:string

    date : string
    
    time : string
}



@Schema({timestamps:true})
export class wallet {
  
    @Prop({ type: String })
    owner: string

    @Prop({ type: Number })
    balance: number

    @Prop({type:String})
    goldWeight:string

    @Prop({ type: String })
    date : string
    
    @Prop({ type: String })
    time : string

}

export const walletSchema = SchemaFactory.createForClass(wallet);