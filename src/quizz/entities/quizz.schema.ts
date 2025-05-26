import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";

export type QuizzDocument = Quizz & mongoose.Document;
@Schema({ timestamps: true })
export class Quizz {
  @Prop({ required: true })
  question: string;
  @Prop({ required: true })
  reply: string;
  @Prop({ required: true })
  points: number;
  @Prop({required:true, default:true})
  status: boolean
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  adminId: string;
}
export const QuizzSchema = SchemaFactory.createForClass(Quizz);
