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
exports.UpdatepickUpDateCommandDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdatepickUpDateCommandDto {
}
exports.UpdatepickUpDateCommandDto = UpdatepickUpDateCommandDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "2025-10-28",
        required: true
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)({}, { message: "The date has be not empty and to  be on this format: YYYY-MM-DD" }),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}$/, { message: "The date must be in the format YYYY-MM-DD" }),
    __metadata("design:type", String)
], UpdatepickUpDateCommandDto.prototype, "pickupDate", void 0);
//# sourceMappingURL=update-pickup-date-command.dto.js.map