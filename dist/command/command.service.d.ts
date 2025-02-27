import { Model } from "mongoose";
import { CreateCommandDto } from './dto/create-command.dto';
import { UpdateCommandDto } from './dto/update-command.dto';
import mongoose from 'mongoose';
import { Command, CommandDocument } from './entities/command.schema';
export declare class CommandService {
    private commandModel;
    constructor(commandModel: Model<CommandDocument>);
    create(createCommandDto: CreateCommandDto, authentificatedId: string): (mongoose.Document<unknown, {}, CommandDocument> & Command & mongoose.Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | "تأكد من الحالة، مبلغ ديال تسبيق كيتستعمل غير فحالة التسبيق" | "مبلغ التسبيق خاص اكون صغر من المبلغ الاجمالي، تأكد مرة أخرى" | "تاريخ ماشي صحيح تأكد مرة أخرى" | "valide" | "حاول مرة خرى";
    scanedUserId(qrcode: string, userId: string): Promise<"حاول نسخQrcode مرة أخرى" | "mabrouk">;
    findAll(userId: string, role: string): Promise<"No orders" | (mongoose.Document<unknown, {}, CommandDocument> & Command & mongoose.Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findOne(id: number): string;
    update(id: number, updateCommandDto: UpdateCommandDto): string;
    remove(id: number): string;
}
