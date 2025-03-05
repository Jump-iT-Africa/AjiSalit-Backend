"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const update_user_dto_1 = require("../dto/update-user.dto");
const update_company_dto_1 = require("../dto/update-company.dto");
const class_transformer_1 = require("class-transformer");
let RoleValidationPipe = class RoleValidationPipe {
    async transform(value, metadata) {
        if (!value || !value.role) {
            throw new common_1.BadRequestException("ختار الوضعية ديالك واش نتا شريكة ولا شخص عادي");
        }
        let dtoInstance;
        if (value.role === 'client') {
            dtoInstance = (0, class_transformer_1.plainToClass)(update_user_dto_1.UpdateUserDto, value);
        }
        else if (value.role === 'company') {
            dtoInstance = (0, class_transformer_1.plainToClass)(update_company_dto_1.UpdateCompanyDto, value);
        }
        else {
            throw new common_1.BadRequestException("ختار الوضعية ديالك واش نتا شريكة ولا شخص عادي");
        }
        const errors = await (0, class_validator_1.validate)(dtoInstance, {
            whitelist: false,
            forbidNonWhitelisted: true,
        });
        if (errors.length > 0) {
            const validationErrors = errors.map(error => ({
                property: error.property,
                constraints: {
                    [Object.keys(error.constraints)[0]]: Object.values(error.constraints)[0]
                }
            }));
            throw new common_1.BadRequestException(validationErrors);
        }
        return dtoInstance;
    }
};
exports.RoleValidationPipe = RoleValidationPipe;
exports.RoleValidationPipe = RoleValidationPipe = __decorate([
    (0, common_1.Injectable)()
], RoleValidationPipe);
//# sourceMappingURL=RoleValidationPipe.js.map