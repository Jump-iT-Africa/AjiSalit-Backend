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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotificationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class sendNotificationDto {
}
exports.sendNotificationDto = sendNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "AjiSalit",
        description: 'title of notification',
    }),
    __metadata("design:type", String)
], sendNotificationDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Your order has been completed successfully.",
        description: 'Message to send in the notification',
    }),
    (0, class_validator_1.IsString)({ message: 'The message should be String' }),
    __metadata("design:type", String)
], sendNotificationDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "ExponentPushToken[aQcWD3F4ELNDS0gbiHccgh]",
        description: 'the expo push notification',
    }),
    (0, class_validator_1.IsString)({ message: 'The expo push token should be String' }),
    (0, class_validator_1.IsNotEmpty)({ message: "The expo push shouldn't be empty" }),
    __metadata("design:type", String)
], sendNotificationDto.prototype, "expoPushToken", void 0);
//# sourceMappingURL=send-notification.dto.js.map