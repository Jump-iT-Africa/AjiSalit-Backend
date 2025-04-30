import mongoose, { Types } from 'mongoose';
export type SiteInfoDocument = SiteInfo & mongoose.Document;
export declare class SiteInfo {
    adminId: string;
    title: string;
    content: string;
    status: string;
}
export declare const SiteInfoSchema: mongoose.Schema<SiteInfo, mongoose.Model<SiteInfo, any, any, any, mongoose.Document<unknown, any, SiteInfo> & SiteInfo & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, SiteInfo, mongoose.Document<unknown, {}, mongoose.FlatRecord<SiteInfo>> & mongoose.FlatRecord<SiteInfo> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
