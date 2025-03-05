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
class ResponseDto {
}
exports.default = ResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '67bda9260433e5b76e39de06',
        description: 'companyId is the id of the company that creates an order',
        required: true,
    }),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], ResponseDto.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '50000',
        description: 'Price of the service',
        required: true,
    }),
    __metadata("design:type", Number)
], ResponseDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'تسبيق',
        description: 'The situation of the order and it can be advanced, paid or not paid',
        required: true,
    }),
    __metadata("design:type", String)
], ResponseDto.prototype, "situation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'قيد الانتظار',
        description: 'The current status of the order',
        required: true,
    }),
    __metadata("design:type", String)
], ResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 2000,
        description: 'advanced amount if it\'s already given',
        required: false,
    }),
    __metadata("design:type", Number)
], ResponseDto.prototype, "advancedAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'rabat',
        description: 'city related to the service',
        required: true,
    }),
    __metadata("design:type", String)
], ResponseDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-10-26',
        description: 'Delivery date of the service',
        required: true,
    }),
    __metadata("design:type", String)
], ResponseDto.prototype, "deliveryDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'null',
        description: 'it will be unpdated in the pick up date',
        required: true,
    }),
    __metadata("design:type", String)
], ResponseDto.prototype, "pickupDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['image1.jpg', 'image2.jpg'],
        description: 'images URLs related to the service',
        required: false,
        type: [String],
    }),
    __metadata("design:type", Array)
], ResponseDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '67bf398590bd476466de96c0',
        description: 'unique identifier of the order',
        required: true,
    }),
    __metadata("design:type", String)
], ResponseDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'null',
        description: 'user ID related to the order, null if not scanned',
        nullable: true,
        required: false,
    }),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], ResponseDto.prototype, "userId", void 0);
//# sourceMappingURL=response-command.dto.js.map