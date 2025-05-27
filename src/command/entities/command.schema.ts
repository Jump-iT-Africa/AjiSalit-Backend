import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Document } from "mongoose";

export type CommandDocument = Command & mongoose.Document;
@Schema({ timestamps: true})
export class Command {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", index: true })
  companyId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
    default: null,
    index: true,
  })
  clientId: string;

  @Prop({
    required: true,
    default: "غير خالص",
    enum: ["خالص", "غير خالص", "تسبيق"],
  })
  situation: string;

  @Prop({
    required: true,
    default: "في طور الانجاز",
    enum: ["في طور الانجاز", "جاهزة للتسليم", "تم تسليم"],
  })
  status: string;

  @Prop({ required: true, default: false, index: true })
  isExpired: boolean;

  @Prop({ required: false, default: null })
  advancedAmount: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: false })
  images: [{ type: String }];

  @Prop({ required: false, index:true })
  deliveryDate: Date;

  @Prop({ required: false, default: null, index:true })
  pickupDate: Date;

  @Prop({ required: true, unique: true,index: true})
  qrCode: string;

  @Prop({ required: true, default: false, index: true })
  isFinished: false;

  @Prop({ required: true, default: false})
  isPickUp: false;

  @Prop({ required: false, default: false })
  isDateChanged: boolean;

  @Prop({ required: false, default: false })
  IsConfirmedByClient: boolean;

  @Prop({ required: false })
  ChangeDateReason: string;

  @Prop({ required: false, default: null,index: true })
  newDate: Date;
}

export const CommandSchema = SchemaFactory.createForClass(Command);

CommandSchema.index({
  companyId: 1,
  clientId: 1,
  isFinished: 1,
  isPickUp: 1,
  pickupDate:1,
  deliveryDate:1,
  newDate:1,
  qrCode:1
});
