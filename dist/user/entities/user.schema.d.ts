import { Document, Types } from 'mongoose';
export type UserDocument = User & Document;
export declare class User {
    name: string;
    role: string;
    phoneNumber: string;
    password?: string;
    city?: string;
    field?: string;
    ice?: number;
    ownRef: string;
    refBy?: string;
    listRefs?: string[];
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
