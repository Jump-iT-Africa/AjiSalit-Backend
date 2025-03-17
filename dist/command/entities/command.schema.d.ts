import * as mongoose from 'mongoose';
export type CommandDocument = Command & mongoose.Document;
export declare class Command {
    companyId: string;
    clientId: string;
    situation: string;
    status: string;
    advancedAmount: number;
    city: string;
    price: number;
    images: [{
        type: String;
    }];
    deliveryDate: Date;
    pickupDate: Date;
    qrCode: string;
}
export declare const CommandSchema: mongoose.Schema<Command, mongoose.Model<Command, any, any, any, mongoose.Document<unknown, any, Command> & Command & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Command, mongoose.Document<unknown, {}, mongoose.FlatRecord<Command>> & mongoose.FlatRecord<Command> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
