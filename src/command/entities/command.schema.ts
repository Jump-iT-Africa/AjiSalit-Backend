import { Prop, Schema, SchemaFactory,} from '@nestjs/mongoose';
import * as  mongoose from 'mongoose';
import { Document } from 'mongoose';


export type CommandDocument = Command & mongoose.Document;
@Schema({ timestamps: true })

export class Command {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref:'User'})
  companyId: string;

  @Prop({type: mongoose.Schema.Types.ObjectId,ref: 'User', required: false, default:null }) 
  clientId: string;
  
  @Prop({required: true, default: "غير خالص", enum: ["خالص", "غير خالص","تسبيق"]})
  situation:string;

  @Prop({ required: true, default:"في طور الانجاز", enum: ["في طور الانجاز", "جاهزة للتسليم", "تم تسليم"] })
  status: string;

  @Prop({required:true, default:false})
  isExpired: boolean;

  @Prop({ required: false, default:null})
  advancedAmount:number;

  @Prop({ required: true })
  price: number; 

  @Prop({ required: false})
  images: [{ type: String }]

  @Prop({ required: false})
  deliveryDate: Date;

  @Prop({ required: false, default:null})
  pickupDate: Date;

  @Prop({required:true, unique:true})
  qrCode: string;

  @Prop({required:true, default:false})
  isFinished: false;

  @Prop({required:true, default:false})
  isPickUp: false;

  @Prop({required:false, default:false})
  isDateChanged: boolean;

  @Prop({required:false, default:false})
  IsConfirmedByClient: boolean;

  @Prop({required:false})
  ChangeDateReason: string;

  @Prop({ required: false, default:null})
  newDate: Date;
}

export const CommandSchema = SchemaFactory.createForClass(Command);
