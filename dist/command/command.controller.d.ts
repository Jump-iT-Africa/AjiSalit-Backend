import { CommandService } from "./command.service";
import { CreateCommandDto } from "./dto/create-command.dto";
import { UpdateCommandDto } from "./dto/update-command.dto";
import { UpdateStatusCommandDto } from "./dto/update-status-command.dto";
import { UpdatepickUpDateCommandDto } from "./dto/update-pickup-date-command.dto";
import { updateStatusConfirmationDto } from "./dto/update-confirmdelivery.dto";
export declare class CommandController {
    private readonly commandService;
    constructor(commandService: CommandService);
    create(createCommandDto: CreateCommandDto, req: any, images: any): Promise<"try again" | (import("mongoose").Document<unknown, {}, import("./entities/command.schema").CommandDocument> & import("./entities/command.schema").Command & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })>;
    scanedUserId(qrcode: string, req: any): Promise<string>;
    findAll(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./entities/command.schema").CommandDocument> & import("./entities/command.schema").Command & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    statistics(): Promise<{
        "Total orders": number;
        "Total of orders made this day": number;
        "Total of orders made this month": any[];
        "Total of orders per companyId": any[];
        "Total of orders of every single day": any[];
        "Total of orders of every single month": any[];
    }>;
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
    confirmDeliveryByClient(orderId: string, updateStatusConfirmation: updateStatusConfirmationDto, req: any): Promise<string>;
    clientReminderNorification(): Promise<any>;
    companyReminderNotification(): Promise<void>;
}
