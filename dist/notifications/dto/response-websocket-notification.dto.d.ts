import { Types } from 'mongoose';
export declare class ResponseNotificationZwbSocket {
    senderId: Types.ObjectId;
    recipientId: Types.ObjectId;
    message: string;
    read: boolean;
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}
