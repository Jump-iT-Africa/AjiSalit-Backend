import mongoose, { Types } from 'mongoose';
export type NotificationDocument = Notification & mongoose.Document;
export declare class Notification {
    senderId: string;
    recipientId: string;
    message: string;
    read: boolean;
    createdAt: Date;
}
export declare const NotificationSchema: mongoose.Schema<Notification, mongoose.Model<Notification, any, any, any, mongoose.Document<unknown, any, Notification> & Notification & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Notification, mongoose.Document<unknown, {}, mongoose.FlatRecord<Notification>> & mongoose.FlatRecord<Notification> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
