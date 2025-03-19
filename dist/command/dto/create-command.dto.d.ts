import { Types } from "mongoose";
export declare class CreateCommandDto {
    companyId?: Types.ObjectId;
    userId?: Types.ObjectId;
    price: number;
    situation: string;
    status: string;
    advancedAmount: number;
    deliveryDate: string;
    pickupDate: string;
    images?: string[];
    qrCode: string;
}
