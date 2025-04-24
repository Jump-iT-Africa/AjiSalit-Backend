import { Types } from "mongoose";
export declare class responseStatusDTO {
    _id: Types.ObjectId;
    companyId: Types.ObjectId;
    clientId: Types.ObjectId;
    situation: string;
    status: string;
    advancedAmount: number;
    city: string;
    price: number;
    images?: string[];
    deliveryDate: string;
    pickupDate: string;
    qrCode: string;
    isFinished: false;
    isPickUp: false;
    __v: 0;
}
