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
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const notifications_service_1 = require("./notifications.service");
const create_notification_dto_1 = require("./dto/create-notification.dto");
const update_notification_dto_1 = require("./dto/update-notification.dto");
const verifyJwt_1 = require("../services/verifyJwt");
const swagger_1 = require("@nestjs/swagger");
const jsonwebtoken_1 = require("jsonwebtoken");
const send_notification_dto_1 = require("./dto/send-notification.dto");
const response_websocket_notification_dto_1 = require("./dto/response-websocket-notification.dto");
let NotificationsController = class NotificationsController {
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    sendNotification(body) {
        return this.notificationsService.sendPushNotification(body.expoPushToken, body.title, body.message, body.data);
    }
    createNotification(recevierId, createNotificationDto, req) {
        try {
            let token = req.headers['authorization']?.split(" ")[1];
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            if (!infoUser) {
                throw new common_1.UnauthorizedException("Try to login again");
            }
            return this.notificationsService.createNewNotification(recevierId, infoUser.id, createNotificationDto);
        }
        catch (e) {
            if (e instanceof jsonwebtoken_1.JsonWebTokenError || e instanceof jsonwebtoken_1.TokenExpiredError)
                throw e;
            throw new common_1.BadRequestException("Try again");
        }
    }
    notifyOrderCompleted(orderId, receiverId, req) {
        try {
            let token = req.headers.authorization;
            if (!token) {
                throw new common_1.UnauthorizedException("Try to login again");
            }
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            if (!infoUser) {
                throw new common_1.UnauthorizedException("Try to login again");
            }
            return this.notificationsService.notificationCompleteOrder(orderId, infoUser, receiverId);
        }
        catch (e) {
            console.log(e);
            throw new common_1.BadRequestException("Ops smth went wrong");
        }
    }
    findAll() {
        return this.notificationsService.findAll();
    }
    findOne(id) {
        return this.notificationsService.findOne(+id);
    }
    update(id, updateNotificationDto) {
        return this.notificationsService.update(+id, updateNotificationDto);
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Push notification to user through expo Push Notification" }),
    (0, swagger_1.ApiBody)({
        type: send_notification_dto_1.sendNotificationDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Sending Body without expo push Token : this error comes from Expo Push Notification Tool',
        schema: {
            example: {
                "statusCode": 500,
                "message": "Internal server error"
            }
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The notification was send successfully, The response comes from expo Push Notification Tool',
        schema: {
            example: {
                "data": {
                    "status": "ok",
                    "id": "0196670b-aa78-7a90-9803-a5fe62ad1b0a"
                }
            }
        },
    }),
    (0, common_1.Post)('/send'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "sendNotification", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Create notification destinited to the reciever" }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBody)({
        type: create_notification_dto_1.CreateNotificationDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "the notification was created successfully, rather it's for broadcasting or notify a specific user",
        type: response_websocket_notification_dto_1.ResponseNotificationZwbSocket
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized error: the user is not logged in ',
        schema: {
            example: {
                statusCode: 401,
                message: "Try to login again",
                error: 'Unauthorized error',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: "the reciever is not found",
        schema: {
            example: {
                statusCode: 404,
                message: "the reciever is not found",
                error: 'Not Found error',
            },
        },
    }),
    (0, common_1.Post)(':recevierId'),
    __param(0, (0, common_1.Param)("recevierId")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_notification_dto_1.CreateNotificationDto, Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "createNotification", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Notify a specific user about the changing in the status of his order" }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(':orderId/:recieverId'),
    __param(0, (0, common_1.Param)("orderId")),
    __param(1, (0, common_1.Param)("recieverId")),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "notifyOrderCompleted", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_notification_dto_1.UpdateNotificationDto]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "update", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map