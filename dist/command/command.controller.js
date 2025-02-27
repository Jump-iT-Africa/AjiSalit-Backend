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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandController = void 0;
const common_1 = require("@nestjs/common");
const command_service_1 = require("./command.service");
const create_command_dto_1 = require("./dto/create-command.dto");
const update_command_dto_1 = require("./dto/update-command.dto");
const verifyJwt_1 = require("../services/verifyJwt");
const swagger_1 = require("@nestjs/swagger");
const response_command_dto_1 = require("./dto/response-command.dto");
let CommandController = class CommandController {
    constructor(commandService) {
        this.commandService = commandService;
    }
    create(createCommandDto, req) {
        try {
            let token = req.headers['authorization'];
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            if (!infoUser) {
                throw new common_1.NotFoundException("حاول تسجل مرة أخرى");
            }
            const authentificatedId = infoUser.id;
            return this.commandService.create(createCommandDto, authentificatedId);
        }
        catch (e) {
            console.log(e);
            throw new common_1.BadRequestException('Try to login again');
        }
    }
    scanedUserId(qrcode, req) {
        let token = req.headers['authorization'];
        let infoUser = (0, verifyJwt_1.validateJwt)(token);
        console.log(infoUser);
        if (!infoUser) {
            console.log("useeeeeeeeeeeeeeeeeer nit found");
            throw new common_1.NotFoundException("حاول تسجل مرة أخرى");
        }
        return this.commandService.scanedUserId(qrcode, infoUser.id);
    }
    findAll(req) {
        let token = req.headers['authorization'];
        let infoUser = (0, verifyJwt_1.validateJwt)(token);
        console.log(infoUser);
        if (!infoUser) {
            console.log("useeeeeeeeeeeeeeeeeer nit found");
            throw new common_1.NotFoundException("حاول تسجل مرة أخرى");
        }
        return this.commandService.findAll(infoUser.id, infoUser.role);
    }
    findOne(id) {
        return this.commandService.findOne(+id);
    }
    update(id, updateCommandDto) {
        return this.commandService.update(+id, updateCommandDto);
    }
    remove(id) {
        return this.commandService.remove(+id);
    }
};
exports.CommandController = CommandController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Give the company the ability to add new order" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'the response returns the details of the Order ',
        type: response_command_dto_1.default,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_command_dto_1.CreateCommandDto, Object]),
    __metadata("design:returntype", void 0)
], CommandController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':qrcode'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'mabrouk',
    }),
    __param(0, (0, common_1.Param)('qrcode')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CommandController.prototype, "scanedUserId", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CommandController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommandController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_command_dto_1.UpdateCommandDto]),
    __metadata("design:returntype", void 0)
], CommandController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommandController.prototype, "remove", null);
exports.CommandController = CommandController = __decorate([
    (0, swagger_1.ApiTags)('Command generated by company'),
    (0, common_1.Controller)('command'),
    __metadata("design:paramtypes", [command_service_1.CommandService])
], CommandController);
//# sourceMappingURL=command.controller.js.map