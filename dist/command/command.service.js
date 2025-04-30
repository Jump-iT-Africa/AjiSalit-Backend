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
const mongoose_3 = require("mongoose");
const command_schema_1 = require("./entities/command.schema");
const user_schema_1 = require("../user/entities/user.schema");
const validationOrder_1 = require("../services/validationOrder");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
const notifications_service_1 = require("../notifications/notifications.service");
const validationPickUpdate_1 = require("../services/validationPickUpdate");
let CommandService = class CommandService {
    constructor(commandModel, userModel, notificationsGateway, notificationsService) {
        this.commandModel = commandModel;
        this.userModel = userModel;
        this.notificationsGateway = notificationsGateway;
        this.notificationsService = notificationsService;
    }
    async create(createCommandDto, authentificatedId) {
        try {
            const existingOrder = await this.commandModel.findOne({ qrCode: createCommandDto.qrCode }).exec();
            if (existingOrder) {
                throw new common_1.ConflictException("This code is already used");
            }
            createCommandDto.companyId = new mongoose_2.Types.ObjectId(authentificatedId);
            let newOrder = new this.commandModel(createCommandDto);
            let resultValidation = (0, validationOrder_1.ValidationOrder)(newOrder);
            if (resultValidation !== "valide") {
                throw new common_1.UnprocessableEntityException(resultValidation);
            }
            let savingOrder = newOrder.save();
            if (!savingOrder) {
                return "try again";
            }
            return savingOrder;
        }
        catch (e) {
            if (e instanceof common_1.UnprocessableEntityException) {
                throw e;
            }
            else if (e instanceof common_1.ConflictException) {
                throw e;
            }
            throw new common_1.BadRequestException(e.message);
        }
    }
    async scanedUserId(qrcode, userId, username) {
        try {
            const updateCommad = await this.commandModel.findOne({ qrCode: qrcode });
            let companyData = await this.userModel.findById(updateCommad.companyId);
            if (!updateCommad)
                throw new common_1.NotFoundException("The order not found");
            console.log("client idddd", updateCommad.clientId, updateCommad);
            if (updateCommad.clientId !== null) {
                throw new common_1.ConflictException("The qrCode is already scanned");
            }
            const updatedCommand = await this.commandModel.findOneAndUpdate({ qrCode: qrcode }, { clientId: userId }, { new: true }).exec();
            if (companyData.expoPushToken) {
                let message = `Your qrCode has been was scanned successfully by ${username}`;
                let notificationSender = await this.notificationsService.sendPushNotification(companyData.expoPushToken, "AjiSalit", message);
                console.log("ohhhhh la laa", notificationSender);
            }
            return "Congratulation the qrCode has been scanned successfully";
        }
        catch (e) {
            if (e instanceof common_1.NotFoundException) {
                throw new common_1.NotFoundException("The order not found");
            }
            if (e instanceof common_1.BadRequestException) {
                throw new common_1.BadRequestException("Try to scan the QrCode again");
            }
            if (e instanceof common_1.ConflictException) {
                throw new common_1.ConflictException("The qrCode is already scanned");
            }
            throw new common_1.BadRequestException("Try again");
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
            const allOrders = await this.commandModel.find(query);
            if (allOrders.length == 0) {
                return "No order found";
            }
            const clientIds = [...new Set(allOrders
                    .filter(order => order.clientId)
                    .map(order => order.clientId.toString()))];
            const companyId = [...new Set(allOrders
                    .filter(order => order.companyId)
                    .map(order => order.companyId.toString()))];
            if (clientIds.length === 0 || companyId.length === 0) {
                return allOrders;
            }
            const users = await this.userModel.find({
                _id: { $in: clientIds.map(id => new mongoose_2.Types.ObjectId(id)) }
            });
            const companies = await this.userModel.find({
                _id: { $in: companyId.map(id => new mongoose_2.Types.ObjectId(id)) }
            });
            const userMap = users.reduce((map, user) => {
                map[user._id.toString()] = {
                    name: user.Fname || "عميل غير معروف",
                };
                return map;
            }, {});
            const companyMap = companies.reduce((map, company) => {
                map[company._id.toString()] = {
                    field: company.field || "مجال غير معروف"
                };
                return map;
            }, {});
            const ordersWithCustomerNames = allOrders.map(order => {
                const clientId = order.clientId ? order.clientId.toString() : null;
                const plainOrder = order.toObject();
                const userData = clientId ? userMap[clientId] : null;
                const companyId = order.companyId ? order.companyId.toString() : null;
                const companyData = companyId ? companyMap[companyId] : null;
                return {
                    ...plainOrder,
                    customerDisplayName: userData?.name || "عميل غير معروف",
                    customerField: companyData?.field || "مجال غير معروف"
                };
            });
            return ordersWithCustomerNames;
        }
        catch (e) {
            console.log(e);
            throw new common_1.BadRequestException("Please try again");
        }
    }
    async findOne(id, infoUser) {
        try {
            let query = { _id: id };
            if (infoUser.role == "client") {
                query.clientId = infoUser.id;
            }
            else if (infoUser.role == "company") {
                query.companyId = infoUser.id;
            }
            console.log(query);
            let order = await this.commandModel.findOne(query).exec();
            if (!order) {
                throw new common_1.NotFoundException("No order found");
            }
            return order;
        }
        catch (e) {
            if (e.name === 'CastError') {
                throw new common_1.BadRequestException("The id of this order is not correct");
            }
            if (e instanceof common_1.NotFoundException) {
                throw e;
            }
            throw new common_1.BadRequestException("Try again");
        }
    }
    async update(authentificatedId, id, updateCommandDto) {
        try {
            if (!mongoose_3.default.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException("The id of this order is not correct");
            }
            const command = await this.commandModel.findById(id).exec();
            console.log(id, command);
            if (!command) {
                throw new common_1.NotFoundException("The order is not found");
            }
            if (command.companyId.toString() !== authentificatedId) {
                throw new common_1.ForbiddenException("You are not allowed to update this oder");
            }
            const updatedCommand = await this.commandModel.findByIdAndUpdate(id, updateCommandDto, { new: true, runValidators: true }).exec();
            if (updateCommandDto.status == "جاهزة للتسليم" && updatedCommand) {
                let clientInfo = await this.userModel.findById(updatedCommand.clientId).exec();
                if (clientInfo && clientInfo.expoPushToken) {
                    let notificationSender = await this.notificationsService.sendPushNotification(clientInfo.expoPushToken, "AjiSalit", `سلام 👋، ${clientInfo?.Fname} أجي ساليت`);
                    console.log("Here's my notification sender: ", notificationSender);
                }
            }
            return updatedCommand;
        }
        catch (e) {
            console.log("error type:", e.constructor.name);
            console.log("Full error:", e);
            if (e.name === 'CastError' || e.name === 'ValidationError') {
                throw new common_1.BadRequestException("The id of this order is not correct");
            }
            if (e instanceof common_1.NotFoundException) {
                throw e;
            }
            if (e instanceof common_1.ForbiddenException) {
                throw e;
            }
            throw new common_1.BadRequestException(`try again : ${e.message}`);
        }
    }
    async updateOrderToDoneStatus(userId, orderId, data) {
        try {
            const command = await this.commandModel.findById(orderId).exec();
            if (!command) {
                throw new common_1.NotFoundException("The command not found");
            }
            if (command.companyId.toString() !== userId) {
                throw new common_1.ForbiddenException("You are not allowed to update this oder");
            }
            let result = await this.commandModel.findByIdAndUpdate(orderId, data, { new: true }).exec();
            let clientInfo = await this.userModel.findById(command.clientId).exec();
            let companyInfo = await this.userModel.findById(command.companyId).exec();
            if (clientInfo && clientInfo.expoPushToken && result) {
                let notificationSender = await this.notificationsService.sendPushNotification(clientInfo.expoPushToken, ` Aji di raz9k chez ${companyInfo.field}`, `سلام 👋، ${clientInfo?.Fname} أجي ساليت`);
                console.log("Here's my notification sender: ", notificationSender);
            }
            return result;
        }
        catch (e) {
            if (e instanceof common_1.NotFoundException || e instanceof common_1.ForbiddenException || e instanceof common_1.BadRequestException) {
                throw e;
            }
            throw new common_1.BadRequestException("Ops Something went wrong");
        }
    }
    async updateOrderpickUpDate(userId, orderId, data) {
        try {
            const command = await this.commandModel.findById(orderId).exec();
            if (!command) {
                throw new common_1.NotFoundException("The command not found");
            }
            if (command.companyId.toString() !== userId) {
                throw new common_1.ForbiddenException("You are not allowed to update this oder");
            }
            let validateDate = (0, validationPickUpdate_1.validationPickUpdate)(data);
            if (validateDate !== "valid") {
                throw new common_1.UnprocessableEntityException(validateDate);
            }
            let result = await this.commandModel.findByIdAndUpdate(orderId, data, { new: true, runValidators: true }).exec();
            if (!result) {
                throw new common_1.BadRequestException("Ops try to update it again");
            }
            let clientInfo = await this.userModel.findById(command.clientId).exec();
            if (clientInfo && clientInfo.expoPushToken && result) {
                console.log("info user:", clientInfo, clientInfo.expoPushToken, result);
                let notificationSender = await this.notificationsService.sendPushNotification(clientInfo.expoPushToken, "AjiSalit", `سلام 👋، ${clientInfo?.Fname} تبدل تاريخ الاستلام ديال طلبية`);
                console.log("Here's my notification sender: ", notificationSender);
            }
            return result;
        }
        catch (e) {
            console.log("opsss", e);
            if (e instanceof common_1.NotFoundException || e instanceof common_1.ForbiddenException || e instanceof common_1.BadRequestException || e instanceof common_1.UnprocessableEntityException) {
                throw e;
            }
            throw new common_1.BadRequestException("Ops Something went wrong");
        }
    }
    async deleteOrder(id, userId) {
        try {
            let order = await this.commandModel.findById(id);
            if (!order) {
                throw new common_1.NotFoundException("The order is not found");
            }
            if (order.companyId.toString() !== userId) {
                throw new common_1.ForbiddenException("You can't delete this order");
            }
            let deleteOrder = await this.commandModel.findByIdAndDelete(id).exec();
            return {
                mess: "The order was deleted successfully",
                deleteOrder
            };
        }
        catch (e) {
            console.log("there's an error", e);
            if (e.name === 'CastError') {
                throw new common_1.BadRequestException("The id of this order is not correct");
            }
            if (e instanceof common_1.NotFoundException) {
                throw new common_1.NotFoundException("The order is not found");
            }
            if (e instanceof common_1.ForbiddenException) {
                throw new common_1.ForbiddenException("You can't delete this order");
            }
            throw new common_1.BadRequestException("Try again");
        }
    }
    async getCommandByQrCode(qrCode, userId, role) {
        try {
            const command = await this.commandModel.findOne({ qrCode }).exec();
            if (!command) {
                throw new common_1.NotFoundException("The order is not found");
            }
            const companyId = command.companyId?.toString();
            if (role === 'company' && userId && companyId !== userId) {
                throw new common_1.ForbiddenException("You don't have permission to view this order");
            }
            let companyData = null;
            if (companyId) {
                companyData = await this.userModel.findById(companyId).select('_id phoneNumber field companyName').exec();
            }
            const plainCommand = command.toObject();
            return {
                ...plainCommand,
                companyId: companyData ? {
                    _id: companyData._id,
                    phoneNumber: companyData.phoneNumber
                } : null,
                companyField: companyData?.field || "مجال غير معروف",
                companyName: companyData?.companyName || "اسم غير معروف"
            };
        }
        catch (e) {
            console.log(e);
            if (e instanceof common_1.NotFoundException || e instanceof common_1.ForbiddenException) {
                throw e;
            }
            throw new common_1.BadRequestException("Try again");
        }
    }
};
exports.CommandService = CommandService;
exports.CommandService = CommandService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(command_schema_1.Command.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => notifications_gateway_1.NotificationsGateway))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        notifications_gateway_1.NotificationsGateway,
        notifications_service_1.NotificationsService])
], CommandService);
//# sourceMappingURL=command.service.js.map