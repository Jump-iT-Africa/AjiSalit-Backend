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
exports.UpdateCompanyDto = void 0;
const update_user_dto_1 = require("./update-user.dto");
const class_validator_1 = require("class-validator");
class UpdateCompanyDto extends update_user_dto_1.UpdateUserDto {
}
exports.UpdateCompanyDto = UpdateCompanyDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: "دخل العنوان و المدينة ديالك" }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "fullAddress", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: "دخل المجال ديالك" }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "field", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: "خصك دخل رقم البطاقة الضريبية أو رقم ICE" }),
    __metadata("design:type", Number)
], UpdateCompanyDto.prototype, "ice", void 0);
//# sourceMappingURL=update-company.dto.js.map