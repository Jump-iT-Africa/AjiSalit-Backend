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
exports.CreateCommandDto = void 0;
const class_validator_1 = require("class-validator");
const mongoose_1 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
class CreateCommandDto {
}
exports.CreateCommandDto = CreateCommandDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], CreateCommandDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], CreateCommandDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 8000,
        required: true
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "kindly add the price of this service" }),
    (0, class_validator_1.IsNumber)({}, { message: "The price has to be a valid number " }),
    __metadata("design:type", Number)
], CreateCommandDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "تسبيق",
        required: true
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "you must add the situation" }),
    (0, class_validator_1.IsEnum)(["خالص", "غير خالص", "تسبيق"]),
    (0, class_validator_1.Matches)(/^(خالص|غير خالص|تسبيق)$/, { message: "The situation must be one of the following: خالص, غير خالص, تسبيق" }),
    __metadata("design:type", String)
], CreateCommandDto.prototype, "situation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "جاهزة للتسليم",
        required: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^(في طور الانجاز|جاهزة للتسليم|تم تسليم)$/, { message: "The status must be one of the following: قيد الانتظار, جاهزة للتسليم, تم تسليم" }),
    (0, class_validator_1.IsEnum)(["في طور الانجاز", "جاهزة للتسليم", "تم تسليم"]),
    __metadata("design:type", String)
], CreateCommandDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 200,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: "The Advanced Amount has to be a valid number " }),
    __metadata("design:type", Number)
], CreateCommandDto.prototype, "advancedAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "2025-10-26",
        required: true
    }),
    (0, class_validator_1.IsDateString)({}, { message: "The date has to  be on this : YYYY-MM-DD" }),
    (0, class_validator_1.IsNotEmpty)({ message: "The delivery Date is required" }),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}$/, { message: "The date must be in the format YYYY-MM-DD" }),
    __metadata("design:type", String)
], CreateCommandDto.prototype, "deliveryDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "2025-10-28",
        required: true
    }),
    (0, class_validator_1.IsDateString)({}, { message: "The date has to  be on this : YYYY-MM-DD" }),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}$/, { message: "The date must be in the format YYYY-MM-DD" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCommandDto.prototype, "pickupDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['image1.jpg', 'image2.jpg'],
        description: 'images URLs related to the service',
        required: false,
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateCommandDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Hgdthej80000",
        required: true
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCommandDto.prototype, "qrCode", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateCommandDto.prototype, "isFinished", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateCommandDto.prototype, "isPickUp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "true",
        required: false
    }),
    __metadata("design:type", Boolean)
], CreateCommandDto.prototype, "isDateChanged", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "sick",
        required: false
    }),
    __metadata("design:type", String)
], CreateCommandDto.prototype, "ChangeDateReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "2025-10-30",
        required: true
    }),
    (0, class_validator_1.IsDateString)({}, { message: "The date has to  be on this : YYYY-MM-DD" }),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}$/, { message: "The date must be in the format YYYY-MM-DD" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCommandDto.prototype, "newDate", void 0);
//# sourceMappingURL=create-command.dto.js.map