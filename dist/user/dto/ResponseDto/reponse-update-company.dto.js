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
exports.ResoponseUpdateCompanyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class ResoponseUpdateCompanyDto {
}
exports.ResoponseUpdateCompanyDto = ResoponseUpdateCompanyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "680f62b232fece2dacde63fe",
        description: 'Id of user'
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ResoponseUpdateCompanyDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "+212698888333",
        description: 'last name'
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ResoponseUpdateCompanyDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Salimaa",
        description: 'first name'
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ResoponseUpdateCompanyDto.prototype, "Fname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "BHM",
        description: 'last name'
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ResoponseUpdateCompanyDto.prototype, "Lname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Salima's Holding",
        description: 'company name'
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ResoponseUpdateCompanyDto.prototype, "companyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [],
        description: 'list reference'
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], ResoponseUpdateCompanyDto.prototype, "listRefs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "company",
        description: "role"
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ResoponseUpdateCompanyDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "pressing",
        description: "Field"
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ResoponseUpdateCompanyDto.prototype, "field", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "89849838984983989389839",
        description: "ice"
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ResoponseUpdateCompanyDto.prototype, "ice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "339F81EE",
        description: "ownRef"
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ResoponseUpdateCompanyDto.prototype, "ownRef", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Azrou",
        description: "city"
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ResoponseUpdateCompanyDto.prototype, "city", void 0);
//# sourceMappingURL=reponse-update-company.dto.js.map