import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & mongoose.Document;
@Schema({ timestamps: true })
export class Notification {

  @Prop({ type: Types.ObjectId,  ref: "User", required: true})
  senderId: string;

  @Prop({ type: Types.ObjectId,  ref: "Company", required: true})
  recipientId: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  read: boolean;

  @Prop({})
  createdAt:Date

}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

