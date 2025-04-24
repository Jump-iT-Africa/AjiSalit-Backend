import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification, NotificationDocument } from './entities/notification.schema';
import mongoose, { Model } from 'mongoose';
import { UserService } from '../user/user.service';
import { CommandService } from '../command/command.service';
export declare class NotificationsService {
    private notificationModel;
    private userService;
    private commandServide;
    private notifications;
    constructor(notificationModel: Model<NotificationDocument>, userService: UserService, commandServide: CommandService);
    createNewNotification(recevierId: any, senderId: any, createNotificationDto: CreateNotificationDto): Promise<mongoose.Document<unknown, {}, NotificationDocument> & Notification & mongoose.Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    sendPushNotification(to: string, title: string, body: string, data?: any): Promise<any>;
    notificationCompleteOrder(orderId: any, senderInfo: any, recevierId: any): Promise<(mongoose.Document<unknown, {}, NotificationDocument> & Notification & mongoose.Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | "there's no client added to send the notification">;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateNotificationDto: UpdateNotificationDto): string;
    remove(id: number): string;
}
