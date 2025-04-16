"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const notification_schema_1 = require("./entities/notification.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_service_1 = require("../user/user.service");
const command_service_1 = require("../command/command.service");
const axios_1 = require("axios");
let NotificationsService = class NotificationsService {
    constructor(notificationModel, userService, commandServide) {
        this.notificationModel = notificationModel;
        this.userService = userService;
        this.commandServide = commandServide;
        this.notifications = [];
    }
    async createNewNotification(recevierId, senderId, createNotificationDto) {
        try {
            if (recevierId == undefined) {
                throw new common_1.UnprocessableEntityException("the reciever id is empty");
            }
            if (typeof recevierId === 'string' && recevierId.length !== 24) {
                throw new common_1.BadRequestException('invalid receiver ID format kindly check your id and try again');
            }
            const recevier = await this.userService.findOne(recevierId);
            if (!recevier) {
                throw new common_1.NotFoundException("the reciever is not found");
            }
            const notification = {
                senderId: senderId,
                recipientId: recevierId,
                message: createNotificationDto.message,
                read: false,
            };
            let newNotification = new this.notificationModel(notification);
            let result = await newNotification.save();
            this.notifications.push(notification);
            if (!result) {
                throw new common_1.BadRequestException("please try again");
            }
            return result;
        }
        catch (e) {
            console.log("create notification", e);
            if (e instanceof common_1.NotFoundException) {
                throw new common_1.NotFoundException('the reciever Id not found try again ');
            }
            if (e instanceof common_1.UnprocessableEntityException) {
                throw new common_1.UnprocessableEntityException("the reciever id should not be empty");
            }
            throw new common_1.BadRequestException("ops smth went wrong");
        }
    }
    async sendPushNotification(to, title, body, data = {}) {
        try {
            const message = {
                to,
                sound: 'default',
                title,
                body,
                data,
            };
            const response = await axios_1.default.post('https://exp.host/--/api/v2/push/send', message, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Expo response:', response.data);
            return response.data;
        }
        catch (error) {
            console.error('Error sending push notification:', error);
            throw error;
        }
    }
    async notificationCompleteOrder(orderId, senderInfo, recevierId) {
        try {
            const order = await this.commandServide.findOne(orderId, senderInfo);
            if (!order) {
                throw new common_1.NotFoundException("Order not found verify id again");
            }
            if (order.clientId == null) {
                return "there's no client added to send the notification";
            }
            if (recevierId == undefined) {
                throw new common_1.UnprocessableEntityException("the reciever id is empty");
            }
            const recevier = await this.userService.findOne(recevierId);
            if (!recevier) {
                throw new common_1.NotFoundException("the reciever Id is not valid");
            }
            let send = await this.createNewNotification(recevierId, senderInfo.id, {
                message: `Aji salit, khod l order dailk  #${orderId}`
            });
            console.log(order);
            return send;
        }
        catch (e) {
            console.log("message error", e);
        }
    }
    findAll() {
        return `This action returns all notifications`;
    }
    findOne(id) {
        return `This action returns a #${id} notification`;
    }
    update(id, updateNotificationDto) {
        return `This action updates a #${id} notification`;
    }
    remove(id) {
        return `This action removes a #${id} notification`;
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => command_service_1.CommandService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        user_service_1.UserService,
        command_service_1.CommandService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map