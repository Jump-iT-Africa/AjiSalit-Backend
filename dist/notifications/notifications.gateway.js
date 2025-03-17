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
var NotificationsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const notifications_service_1 = require("./notifications.service");
const user_service_1 = require("../user/user.service");
const verifyJwt_1 = require("../services/verifyJwt");
const jsonwebtoken_1 = require("jsonwebtoken");
let NotificationsGateway = NotificationsGateway_1 = class NotificationsGateway {
    constructor(notificationService, userService) {
        this.notificationService = notificationService;
        this.userService = userService;
        this.logger = new common_1.Logger(NotificationsGateway_1.name);
    }
    async handleConnection(client) {
        const token = client.handshake.headers.authorization;
        if (!token) {
            client.disconnect();
            throw new common_1.UnauthorizedException('please try to login again');
        }
        ;
        const infoUser = (0, verifyJwt_1.validateJwt)(token);
        if (!infoUser) {
            client.disconnect();
            throw new common_1.UnauthorizedException('the user must loggin');
        }
        let userId = infoUser.id;
        try {
            let updateSocketId = await this.userService.updateSocketId(userId, client.id);
            this.logger.log(`yeeeeee connected: ${userId}, with this socketid`, client.id);
        }
        catch (e) {
            console.log('message');
            client.disconnect();
            if (e instanceof jsonwebtoken_1.JsonWebTokenError) {
                throw new common_1.UnauthorizedException('please try to login again');
            }
        }
    }
    async handleDisconnect(client) {
        const token = client.handshake.headers.authorization;
        if (!token) {
            client.disconnect();
            throw new common_1.UnauthorizedException('please try to login again');
        }
        ;
        const infoUser = (0, verifyJwt_1.validateJwt)(token);
        if (!infoUser) {
            client.disconnect();
            throw new common_1.UnauthorizedException('the user must loggin');
        }
        let userId = infoUser.id;
        if (userId) {
            await this.userService.updateSocketId(userId, null);
            this.logger.log(`client disconnected: ${userId}`);
        }
    }
};
exports.NotificationsGateway = NotificationsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationsGateway.prototype, "server", void 0);
exports.NotificationsGateway = NotificationsGateway = NotificationsGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: "notification", cors: { origin: '*' } }),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService,
        user_service_1.UserService])
], NotificationsGateway);
//# sourceMappingURL=notifications.gateway.js.map