import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, default:null })
  name: string;

  @Prop({required: true, type: String})
  role: string;

  @Prop({ required: true, unique: true, type: String })
  phoneNumber: string;

  @Prop({ required: true, unique: false, type: String })
  password?: string;

  @Prop({ required:true, default:null })
  city?:string;

  @Prop({required:false, default:null})
  field?:string

  @Prop({required:false, default:null})
  ice?:number


  @Prop({ required: false, unique: true })
  ownRef: string;

  @Prop({ required: false })
  refBy?: string;

  @Prop({ type: [String], required: false, default: [] })
  listRefs?: string[];

}

export const UserSchema = SchemaFactory.createForClass(User);