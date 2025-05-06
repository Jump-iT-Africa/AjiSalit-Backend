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
exports.CreateSiteInfoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateSiteInfoDto {
}
exports.CreateSiteInfoDto = CreateSiteInfoDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Support',
        description: "The title info",
        required: true
    }),
    (0, class_validator_1.IsString)({ message: "The title should be string and shouldn't be empty" }),
    __metadata("design:type", String)
], CreateSiteInfoDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras placerat faucibus aliquam. Duis dapibus eleifend consequat. Pellentesque posuere nunc ac sapien eleifend tincidunt. Proin mollis leo ut nunc ultricies, eu scelerisque odio sodales. Aliquam vitae mauris ac sem hendrerit luctus sed molestie risus. Vestibulum suscipit felis sit amet turpis congue imperdiet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Proin sapien dui, cursus eu eleifend et, semper in sapien. Proin mattis ultrices suscipit.',
        description: "The content of the website info",
        required: true
    }),
    (0, class_validator_1.IsString)({ message: "the content should be text or string" }),
    (0, class_validator_1.IsNotEmpty)({ message: "The content should not be empty" }),
    __metadata("design:type", String)
], CreateSiteInfoDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ example: 'saved', required: true }),
    (0, class_validator_1.IsEnum)(["saved", "draft"]),
    (0, class_validator_1.Matches)(/^(saved|draft)$/, { message: "The status should be either saved or draft" }),
    __metadata("design:type", String)
], CreateSiteInfoDto.prototype, "status", void 0);
//# sourceMappingURL=create-siteinfo.dto.js.map