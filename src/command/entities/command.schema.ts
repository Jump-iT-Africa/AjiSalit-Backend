import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Document } from "mongoose";

export type CommandDocument = Command & mongoose.Document;
@Schema({ timestamps: true })
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
    default: "UNPAID",
    enum: ["PAID", "UNPAID", "PREPAYMENT"],
  })
  situation: string;

  @Prop({
    required: true,
    default: "INPROGRESS",
    enum: ["INPROGRESS", "FINISHED", "ARCHIVED", "EXPIRED"],
    index: true,
  })
  status: string;

  @Prop({ required: false, default: null })
  advancedAmount: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: false })
  images: [{ type: String }];

  @Prop({ required: false, default: null, index: true })
  estimatedDeliveryDate: Date;

  @Prop({ required: false, default: null, index: true })
  pickupDate: Date;

  @Prop({ required: true, unique: true, index: true })
  qrCode: string;

  @Prop({ required: false, default: false })
  isDateChanged: boolean;

  @Prop({ required: false, default: false })
  isConfirmedByClient: boolean;

  @Prop({ required: false, default: null })
  ChangeDateReason: string;

  @Prop({ required: false, default: null, index: true })
  newEstimatedDeliveryDate: Date;
}

export const CommandSchema = SchemaFactory.createForClass(Command);

CommandSchema.index({
  companyId: 1,
  clientId: 1,
  pickupDate: 1,
  estimatedDeliveryDate: 1,
  newEstimatedDeliveryDate: 1,
  qrCode: 1,
  status: 1,
});
