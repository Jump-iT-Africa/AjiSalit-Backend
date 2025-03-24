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
const swagger_1 = require("@nestjs/swagger");
const mongoose_1 = require("mongoose");
class ResponseFcmDto {
}
exports.default = ResponseFcmDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "67d94bd7567f4c7c7a207c51",
        description: 'id of sender',
    }),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], ResponseFcmDto.prototype, "senderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '67d949596f68ef0a9892f91e',
        description: 'id of reciever',
    }),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], ResponseFcmDto.prototype, "recipientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Your order has been completed successfully',
        description: 'the message of the notification',
    }),
    __metadata("design:type", String)
], ResponseFcmDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
        description: 'the status of notification is it seen or not',
    }),
    __metadata("design:type", Boolean)
], ResponseFcmDto.prototype, "read", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "67dc0944729af5dae8b5393c",
        description: 'the  id of notification',
    }),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], ResponseFcmDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "2025-03-20T12:25:40.629Z",
        description: "Date and time of creation "
    }),
    __metadata("design:type", Date)
], ResponseFcmDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "2025-03-20T12:25:40.629Z",
        description: "Date and time of update "
    }),
    __metadata("design:type", Date)
], ResponseFcmDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 0,
    }),
    __metadata("design:type", Number)
], ResponseFcmDto.prototype, "__v", void 0);
//# sourceMappingURL=response-fmc.dto.js.map