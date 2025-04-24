import { Model } from "mongoose";
import { CreateCommandDto } from './dto/create-command.dto';
import { UpdateCommandDto } from './dto/update-command.dto';
import mongoose from 'mongoose';
import { Command, CommandDocument } from './entities/command.schema';
import { UserDocument } from '../user/entities/user.schema';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { NotificationsService } from 'src/notifications/notifications.service';
export declare class CommandService {
    private commandModel;
    private userModel;
    private readonly notificationsGateway;
    private notificationsService;
    constructor(commandModel: Model<CommandDocument>, userModel: Model<UserDocument>, notificationsGateway: NotificationsGateway, notificationsService: NotificationsService);
    create(createCommandDto: CreateCommandDto, authentificatedId: string): Promise<"try again" | (mongoose.Document<unknown, {}, CommandDocument> & Command & mongoose.Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })>;
    scanedUserId(qrcode: string, userId: string, username: string): Promise<string>;
    findAll(userId: string, role: string): Promise<"ماكين حتا طلب" | (mongoose.Document<unknown, {}, CommandDocument> & Command & mongoose.Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[] | {
        customerDisplayName: any;
        customerField: any;
        companyId: string;
        clientId: string;
        situation: string;
        status: string;
        advancedAmount: number;
        city: string;
        price: number;
        images: [{
            type: String;
        }];
        deliveryDate: Date;
        pickupDate: Date;
        qrCode: string;
        isFinished: false;
        isPickUp: false;
        _id: unknown;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: mongoose.Collection;
        db: mongoose.Connection;
        errors?: mongoose.Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: mongoose.Schema;
        __v: number;
    }[]>;
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
    updateOrderToDonepickUpDate(userId: any, orderId: any, data: any): Promise<mongoose.Document<unknown, {}, CommandDocument> & Command & mongoose.Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    deleteOrder(id: string, userId: any): Promise<{
        mess: string;
        deleteOrder: mongoose.Document<unknown, {}, CommandDocument> & Command & mongoose.Document<unknown, any, any> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    getCommandByQrCode(qrCode: string): Promise<Command>;
}
