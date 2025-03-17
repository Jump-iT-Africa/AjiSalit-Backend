import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification, NotificationDocument } from './entities/notification.schema';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { CommandService } from 'src/command/command.service';
export declare class NotificationsService {
    private notificationModel;
    private userService;
    private commandServide;
    private server;
    private notifications;
    constructor(notificationModel: Model<NotificationDocument>, userService: UserService, commandServide: CommandService);
    createNewNotification(recevierId: any, senderId: any, createNotificationDto: CreateNotificationDto): Promise<import("mongoose").Document<unknown, {}, NotificationDocument> & Notification & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    notificationCompleteOrder(orderId: any, senderInfo: any, recevierId: any): Promise<void>;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateNotificationDto: UpdateNotificationDto): string;
    remove(id: number): string;
}
