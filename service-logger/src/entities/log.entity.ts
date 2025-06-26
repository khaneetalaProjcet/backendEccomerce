import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogDocument = Log & Document;

@Schema({ timestamps: true })
export class Log {
  @Prop({ required: true })
  serviceName: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true, enum: ['admin', 'user'] })
  role: 'admin' | 'user';

  @Prop({ required: true })
  action: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);
