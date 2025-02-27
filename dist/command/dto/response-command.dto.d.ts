import { Types } from 'mongoose';
export default class ResponseDto {
    companyId: Types.ObjectId;
    price: number;
    situation: string;
    status: string;
    advancedAmount?: number;
    city: string;
    deliveryDate: string;
    images?: string[];
    _id: string;
    userId?: Types.ObjectId | null;
}
