import { HydratedDocument } from 'mongoose';
export type CompanyDocument = HydratedDocument<Company>;
export declare class Question {
    question: string;
    answerType: string;
    options?: string[];
}
export declare class Company {
    name: string;
    type: string;
    address: string;
    Phone: number;
    questions: Question[];
    createdAt: Date;
}
export declare const CompanySchema: import("mongoose").Schema<Company, import("mongoose").Model<Company, any, any, any, import("mongoose").Document<unknown, any, Company> & Company & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Company, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Company>> & import("mongoose").FlatRecord<Company> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
