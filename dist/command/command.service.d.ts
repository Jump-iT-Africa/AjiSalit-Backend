import { Model } from "mongoose";
import { CreateCommandDto } from "./dto/create-command.dto";
import { UpdateCommandDto } from "./dto/update-command.dto";
import mongoose from "mongoose";
import { Command, CommandDocument } from "./entities/command.schema";
import { UserDocument } from "../user/entities/user.schema";
import { NotificationsGateway } from "../notifications/notifications.gateway";
import { NotificationsService } from "../notifications/notifications.service";
import { Connection } from "mongoose";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
export declare class CommandService {
    private readonly connection;
    private commandModel;
    private userModel;
    private readonly notificationsGateway;
    private notificationsService;
    private readonly httpService;
    private readonly configService;
    private readonly bunnyStorageUrl;
    private readonly bunnyAccessKey;
    private readonly bunnyStorageZone;
    constructor(connection: Connection, commandModel: Model<CommandDocument>, userModel: Model<UserDocument>, notificationsGateway: NotificationsGateway, notificationsService: NotificationsService, httpService: HttpService, configService: ConfigService);
    uploadImageToBunny(file: Buffer, filename: string): Promise<string>;
    create(createCommandDto: CreateCommandDto, authentificatedId: string, images: any): Promise<"try again" | (mongoose.Document<unknown, {}, CommandDocument> & Command & mongoose.Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })>;
    scanedUserId(qrcode: string, userId: string, username: string): Promise<string>;
    findAll(userId: string, role: string): Promise<(mongoose.Document<unknown, {}, CommandDocument> & Command & mongoose.Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string, infoUser: any): Promise<mongoose.Document<unknown, {}, CommandDocument> & Command & mongoose.Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    update(authentificatedId: any, id: any, updateCommandDto: UpdateCommandDto): Promise<mongoose.Document<unknown, {}, CommandDocument> & Command & mongoose.Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateOrderToDoneStatus(userId: any, orderId: any, data: any): Promise<mongoose.Document<unknown, {}, CommandDocument> & Command & mongoose.Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateOrderpickUpDate(userId: any, orderId: any, data: any): Promise<mongoose.Document<unknown, {}, CommandDocument> & Command & mongoose.Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    extractFileNameFromCDN(url: string): string | null;
    deleteBunnyImage(fileName: string): Promise<void>;
    deleteOrder(id: string, userId: any): Promise<{
        message: string;
    }>;
    getCommandByQrCode(qrCode: string, userId?: string, role?: string): Promise<any>;
    confirmDeliveryByClient(orderId: any, clientInfo: any, updateStatusConfirmation: any): Promise<string>;
    getStatistics(): Promise<{
        "Total orders": number;
        "Total of orders made this day": number;
        "Total of orders made this month": any[];
        "Total of orders per companyId": any[];
        "Total of orders of every single day": any[];
        "Total of orders of every single month": any[];
    }>;
    commandClientReminder(): Promise<any>;
    commandCompanyReminder(): Promise<void>;
}
