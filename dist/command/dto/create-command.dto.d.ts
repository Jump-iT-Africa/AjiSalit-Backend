import { Types } from "mongoose";
export declare class CreateCommandDto {
    companyId?: Types.ObjectId;
    userId?: Types.ObjectId;
    price: number;
    situation: string;
    status: string;
    advancedAmount: number;
    city: string;
    deliveryDate: string;
    images?: string[];
    qrCode: string;
}
