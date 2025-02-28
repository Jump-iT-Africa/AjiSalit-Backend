import { Prop, Schema, SchemaFactory,} from '@nestjs/mongoose';
import * as  mongoose from 'mongoose';
import { Document } from 'mongoose';


export type CommandDocument = Command & mongoose.Document;
@Schema()
export class Command {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref:'User'})
  companyId: string;

  @Prop({type: mongoose.Schema.Types.ObjectId,ref: 'User', required: false, default:null }) 
  clientId: string;
  
  @Prop({required: true, default: "غير خالص", enum: ["خالص", "غير خالص","تسبيق"]})
  situation:string;

  @Prop({ required: true, default:"قيد الانتظار", enum: ["في طور الانجاز","قيد الانتظار", "جاهزة للتسليم", "تم تسليم"] })
  status: string;
  
  @Prop({ required: false, default:null})
  advancedAmount:number;

  @Prop({required: true})
  city:string;

  @Prop({ required: true })
  price: number; 

  @Prop({ required: false})
  images?: string[];

  @Prop({ required: true })
  deliveryDate: Date;

  @Prop({ required: false, default:null})
  pickupDate: Date;

  @Prop({required:true, unique:true})
  qrCode: string;
}

export const CommandSchema = SchemaFactory.createForClass(Command);
