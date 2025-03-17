import { Types } from 'mongoose';
export default class ResponseDto {
    companyId: Types.ObjectId;
    price: number;
    situation: string;
    status: string;
    advancedAmount?: number;
    city: string;
    deliveryDate: string;
    pickupDate: string;
    images?: string[];
    userId?: Types.ObjectId | null;
}
