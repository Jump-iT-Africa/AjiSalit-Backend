import { Types } from "mongoose";
export declare class responseStatusDTO {
    _id: Types.ObjectId;
    companyId: Types.ObjectId;
    clientId: Types.ObjectId;
    situation: string;
    status: string;
    advancedAmount: number;
    price: number;
    images?: string[];
    deliveryDate: string;
    pickupDate: string;
    qrCode: string;
    isFinished: false;
    isPickUp: false;
    __v: 0;
}
