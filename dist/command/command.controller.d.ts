import { CommandService } from './command.service';
import { CreateCommandDto } from './dto/create-command.dto';
import { UpdateCommandDto } from './dto/update-command.dto';
export declare class CommandController {
    private readonly commandService;
    constructor(commandService: CommandService);
    create(createCommandDto: CreateCommandDto, req: any): (import("mongoose").Document<unknown, {}, import("./entities/command.schema").CommandDocument> & import("./entities/command.schema").Command & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | "تأكد من الحالة، مبلغ ديال تسبيق كيتستعمل غير فحالة التسبيق" | "مبلغ التسبيق خاص اكون صغر من المبلغ الاجمالي، تأكد مرة أخرى" | "تاريخ ماشي صحيح تأكد مرة أخرى" | "valide" | "حاول مرة خرى";
    scanedUserId(qrcode: string, req: any): Promise<"حاول نسخQrcode مرة أخرى" | "mabrouk">;
    findAll(req: any): Promise<"No orders" | (import("mongoose").Document<unknown, {}, import("./entities/command.schema").CommandDocument> & import("./entities/command.schema").Command & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string): string;
    update(id: string, updateCommandDto: UpdateCommandDto): string;
    remove(id: string): string;
}
