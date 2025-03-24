import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    createNotification(recevierId: string, createNotificationDto: CreateNotificationDto, req: any): Promise<import("mongoose").Document<unknown, {}, import("./entities/notification.schema").NotificationDocument> & import("./entities/notification.schema").Notification & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    notifyOrderCompleted(orderId: string, receiverId: string, req: any): Promise<(import("mongoose").Document<unknown, {}, import("./entities/notification.schema").NotificationDocument> & import("./entities/notification.schema").Notification & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | "there's no client added to send the notification">;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateNotificationDto: UpdateNotificationDto): string;
    remove(id: string): string;
}
