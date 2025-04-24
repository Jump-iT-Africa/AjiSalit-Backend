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
exports.responseStatusDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const mongoose_1 = require("mongoose");
class responseStatusDTO {
}
exports.responseStatusDTO = responseStatusDTO;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "6809076a0d062a9147e7eb4c",
        description: 'Command Id'
    }),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], responseStatusDTO.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "680673aa30cbfdd8aa2b1676",
        description: 'Commpany id'
    }),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], responseStatusDTO.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "68091f687844071f178dc266",
        description: 'Client id'
    }),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], responseStatusDTO.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "تسبيق",
        description: 'situation'
    }),
    __metadata("design:type", String)
], responseStatusDTO.prototype, "situation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "جاهزة للتسليم",
        description: 'status'
    }),
    __metadata("design:type", String)
], responseStatusDTO.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 9000,
        description: 'adavncedAmount'
    }),
    __metadata("design:type", Number)
], responseStatusDTO.prototype, "advancedAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 90000,
        description: "price"
    }),
    __metadata("design:type", Number)
], responseStatusDTO.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [],
        description: "images"
    }),
    __metadata("design:type", Array)
], responseStatusDTO.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "2025-04-27T00:00:00.000Z",
        description: "Delivery Date"
    }),
    __metadata("design:type", String)
], responseStatusDTO.prototype, "deliveryDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "2025-04-27T00:00:00.000Z",
        description: "Pick up date"
    }),
    __metadata("design:type", String)
], responseStatusDTO.prototype, "pickupDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Yhjhkh8hiuy8y88",
        description: "qrcode"
    }),
    __metadata("design:type", String)
], responseStatusDTO.prototype, "qrCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
        description: "finished or not"
    }),
    __metadata("design:type", Boolean)
], responseStatusDTO.prototype, "isFinished", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
        description: "picked or not"
    }),
    __metadata("design:type", Boolean)
], responseStatusDTO.prototype, "isPickUp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 0,
        description: "__v by default "
    }),
    __metadata("design:type", Number)
], responseStatusDTO.prototype, "__v", void 0);
//# sourceMappingURL=reponse-update-status-command.dto.js.map