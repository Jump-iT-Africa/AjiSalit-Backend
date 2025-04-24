import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from './notifications.service';
import { UserService } from '../user/user.service';
export declare class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly notificationService;
    private readonly userService;
    private readonly logger;
    server: Server;
    constructor(notificationService: NotificationsService, userService: UserService);
    handleConnection(client: any): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleStatusNotification(orderId: string, clientId: string, companyId: string): Promise<void>;
}
