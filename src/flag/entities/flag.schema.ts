import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Types } from "mongoose";

export type FlagDocument = Flag & mongoose.Document;
@Schema({ timestamps: true})
export class Flag{
    @Prop({required:true})
    title:string
    @Prop({required:true, default:true})
    isVisible:Boolean
    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    adminId: string;
    
}

export const FlagSchema = SchemaFactory.createForClass(Flag);