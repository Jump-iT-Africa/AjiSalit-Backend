import { CommandService } from './command.service';
import { CreateCommandDto } from './dto/create-command.dto';
import { UpdateCommandDto } from './dto/update-command.dto';
import { UpdateStatusCommandDto } from './dto/update-status-command.dto';
import { UpdatepickUpDateCommandDto } from './dto/update-pickup-date-command.dto';
export declare class CommandController {
    private readonly commandService;
    constructor(commandService: CommandService);
    create(createCommandDto: CreateCommandDto, req: any): Promise<"try again" | (import("mongoose").Document<unknown, {}, import("./entities/command.schema").CommandDocument> & import("./entities/command.schema").Command & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })>;
    scanedUserId(qrcode: string, req: any): Promise<string>;
    findAll(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./entities/command.schema").CommandDocument> & import("./entities/command.schema").Command & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[] | "No order found" | {
        customerDisplayName: any;
        customerField: any;
        companyId: string;
        clientId: string;
        situation: string;
        status: string;
        isExpired: boolean;
        advancedAmount: number;
        price: number;
        images: [{
            type: String;
        }];
        deliveryDate: Date;
        pickupDate: Date;
        qrCode: string;
        isFinished: false;
        isPickUp: false;
        isDateChanged: boolean;
        ChangeDateReason: string;
        newDate: Date;
        _id: unknown;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }[]>;
    findOne(id: string, req: any): Promise<import("mongoose").Document<unknown, {}, import("./entities/command.schema").CommandDocument> & import("./entities/command.schema").Command & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    update(id: string, updateCommandDto: UpdateCommandDto, req: any): Promise<import("mongoose").Document<unknown, {}, import("./entities/command.schema").CommandDocument> & import("./entities/command.schema").Command & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
    scanQrCode(qrCode: string, req: any): Promise<any>;
    updateStatusToDone(orderId: string, updatestatusDTo: UpdateStatusCommandDto, req: any): Promise<import("mongoose").Document<unknown, {}, import("./entities/command.schema").CommandDocument> & import("./entities/command.schema").Command & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updatepickUpDate(orderId: string, updatepickUpDateDTo: UpdatepickUpDateCommandDto, req: any): Promise<import("mongoose").Document<unknown, {}, import("./entities/command.schema").CommandDocument> & import("./entities/command.schema").Command & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
