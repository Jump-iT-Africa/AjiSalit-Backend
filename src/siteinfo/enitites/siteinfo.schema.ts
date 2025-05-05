import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type SiteInfoDocument = SiteInfo & mongoose.Document;
@Schema({ timestamps: true })
export class SiteInfo {
    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    adminId: string;

    @Prop({ required: true })
    title: string

    @Prop({required:true})
    content: string

    @Prop({required:true, default: "saved", enum: ["saved","draft"]})
    status:string

}

export const SiteInfoSchema = SchemaFactory.createForClass(SiteInfo);

