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
exports.CommandService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const command_schema_1 = require("./entities/command.schema");
const validationOrder_1 = require("../services/validationOrder");
let CommandService = class CommandService {
    constructor(commandModel) {
        this.commandModel = commandModel;
    }
    create(createCommandDto, authentificatedId) {
        try {
            createCommandDto.companyId = new mongoose_2.Types.ObjectId(authentificatedId);
            let newOrder = new this.commandModel(createCommandDto);
            if ((0, validationOrder_1.ValidationOrder)(newOrder) !== "valide") {
                return (0, validationOrder_1.ValidationOrder)(newOrder);
            }
            let savingOrder = newOrder.save();
            if (!savingOrder) {
                return "حاول مرة خرى";
            }
            return newOrder;
        }
        catch (e) {
            console.log("ops an error", e);
            throw new common_1.BadRequestException("حاول مرة خرى");
        }
    }
    async scanedUserId(qrcode, userId) {
        try {
            const updatedCommand = await this.commandModel.findOneAndUpdate({ qrCodeUrl: qrcode }, { clientId: userId }, { new: true }).exec();
            if (!updatedCommand)
                return "حاول نسخQrcode مرة أخرى";
            return "mabrouk";
        }
        catch (e) {
            console.log(e);
            throw new common_1.BadRequestException("حاول مرة خرى");
        }
    }
    async findAll(userId, role) {
        try {
            let query = {};
            if (role == "client") {
                query = { clientId: userId };
            }
            else if (role == "company") {
                query = { companyId: userId };
            }
            else {
                console.log(userId, role);
                return "No orders";
            }
            const allOrders = await this.commandModel.find(query);
            return allOrders;
        }
        catch (e) {
            console.log(e);
            throw new common_1.BadRequestException("حاول مرة خرى");
        }
    }
    findOne(id) {
        return `This action returns a #${id} command`;
    }
    update(id, updateCommandDto) {
        return `This action updates a #${id} command`;
    }
    remove(id) {
        return `This action removes a #${id} command`;
    }
};
exports.CommandService = CommandService;
exports.CommandService = CommandService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(command_schema_1.Command.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CommandService);
//# sourceMappingURL=command.service.js.map