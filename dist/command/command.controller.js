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
const jsonwebtoken_1 = require("jsonwebtoken");
const update_status_command_dto_1 = require("./dto/update-status-command.dto");
const update_pickup_date_command_dto_1 = require("./dto/update-pickup-date-command.dto");
const reponse_update_status_command_dto_1 = require("./dto/reponse-update-status-command.dto");
let CommandController = class CommandController {
    constructor(commandService) {
        this.commandService = commandService;
    }
    create(createCommandDto, req) {
        try {
            let token = req.headers['authorization']?.split(" ")[1];
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            console.log(infoUser.role);
            if (!infoUser) {
                throw new common_1.UnauthorizedException("Try to login again");
            }
            if (infoUser.role !== "company") {
                throw new common_1.ForbiddenException("you are not allowed to add an Order, you have to have company role to do so");
            }
            const authentificatedId = infoUser.id;
            return this.commandService.create(createCommandDto, authentificatedId);
        }
        catch (e) {
            if (e instanceof jsonwebtoken_1.JsonWebTokenError)
                throw new common_1.UnauthorizedException("Try to login again");
            if (e instanceof common_1.ForbiddenException) {
                throw new common_1.ForbiddenException("you are not allowed to add an Order, you have to have company role to do so");
            }
            throw new common_1.BadRequestException('Ops smth went wrong', e);
        }
    }
    scanedUserId(qrcode, req) {
        try {
            let token = req.headers['authorization']?.split(" ")[1];
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            if (!infoUser || !token) {
                throw new common_1.UnauthorizedException("Try to login again");
            }
            if (infoUser.role !== "client" && infoUser.role !== "admin") {
                throw new common_1.ForbiddenException("You can't scan this qrCode unless you have the client role");
            }
            return this.commandService.scanedUserId(qrcode, infoUser.id, infoUser.username);
        }
        catch (e) {
            if (e instanceof common_1.ForbiddenException) {
                throw new common_1.ForbiddenException("You can't scan this qrCode unless you have the client role");
            }
            if (e instanceof jsonwebtoken_1.JsonWebTokenError || e instanceof jsonwebtoken_1.TokenExpiredError)
                throw new common_1.UnauthorizedException("Try to login again");
            if (e instanceof common_1.UnauthorizedException) {
                throw new common_1.UnauthorizedException("Try to login again");
            }
            if (e instanceof common_1.ConflictException) {
                throw new common_1.ConflictException("The qrCode is already scanned");
            }
            throw new common_1.BadRequestException("ops smth went wrong");
        }
    }
    findAll(req) {
        try {
            let token = req.headers['authorization']?.split(" ")[1];
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            if (!infoUser || !token) {
                throw new common_1.UnauthorizedException("Try to login again");
            }
            return this.commandService.findAll(infoUser.id, infoUser.role);
        }
        catch (e) {
            console.log(e);
            if (e instanceof jsonwebtoken_1.JsonWebTokenError || e instanceof jsonwebtoken_1.TokenExpiredError)
                throw new common_1.UnauthorizedException("Try to login again");
            if (e instanceof common_1.UnauthorizedException) {
                throw new common_1.UnauthorizedException("Try to login again");
            }
            throw new common_1.BadRequestException("Try again");
        }
    }
    findOne(id, req) {
        try {
            let token = req.headers['authorization']?.split(" ")[1];
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            console.log(infoUser);
            if (!infoUser) {
                throw new common_1.UnauthorizedException("Try to login again");
            }
            return this.commandService.findOne(id, infoUser);
        }
        catch (e) {
            if (e instanceof jsonwebtoken_1.JsonWebTokenError || e instanceof jsonwebtoken_1.TokenExpiredError)
                throw new common_1.UnauthorizedException("Try to login again");
            throw new common_1.BadRequestException("Try again");
        }
    }
    update(id, updateCommandDto, req) {
        try {
            let token = req.headers['authorization']?.split(" ")[1];
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            if (!infoUser) {
                throw new common_1.UnauthorizedException("Try to login again");
            }
            if (infoUser.role !== "company") {
                throw new common_1.ForbiddenException("You are not allowed to update this oder");
            }
            return this.commandService.update(infoUser.id, id, updateCommandDto);
        }
        catch (e) {
            console.log(e);
            if (e instanceof jsonwebtoken_1.JsonWebTokenError || e instanceof jsonwebtoken_1.TokenExpiredError)
                throw new common_1.UnauthorizedException("Try to login again");
            if (e instanceof common_1.ForbiddenException) {
                throw new common_1.ForbiddenException("You are not allowed to update this oder");
            }
            throw new common_1.BadRequestException("Try again");
        }
    }
    remove(id, req) {
        try {
            let token = req.headers['authorization']?.split(" ")[1];
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            if (!infoUser) {
                throw new common_1.UnauthorizedException("Try to login again");
            }
            if (infoUser.role !== "company") {
                throw new common_1.ForbiddenException("You can't delete this order");
            }
            return this.commandService.deleteOrder(id, infoUser.id);
        }
        catch (e) {
            console.log(e);
            if (e instanceof jsonwebtoken_1.JsonWebTokenError || e instanceof jsonwebtoken_1.TokenExpiredError)
                throw new common_1.UnauthorizedException("Try to login again");
            if (e instanceof common_1.ForbiddenException) {
                throw new common_1.ForbiddenException("You are not allowed to update this oder");
            }
            throw new common_1.BadRequestException("Try again");
        }
    }
    async scanQrCode(qrCode, req) {
        try {
            let token = req.headers['authorization']?.split(" ")[1];
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            if (!infoUser) {
                throw new common_1.UnauthorizedException("Try to login again");
            }
            return this.commandService.getCommandByQrCode(qrCode);
        }
        catch (e) {
            console.log(e);
            if (e instanceof jsonwebtoken_1.JsonWebTokenError || e instanceof jsonwebtoken_1.TokenExpiredError)
                throw new common_1.UnauthorizedException("Try to login again");
            if (e instanceof common_1.ForbiddenException) {
                throw new common_1.ForbiddenException("You are not allowed to update this oder");
            }
            throw new common_1.BadRequestException("Try again");
        }
    }
    async updateStatusToDone(orderId, updatestatusDTo, req) {
        try {
            let token = req.headers['authorization']?.split(" ")[1];
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            if (!infoUser) {
                throw new common_1.UnauthorizedException("Try to login again");
            }
            let result = await this.commandService.updateOrderToDoneStatus(infoUser.id, orderId, updatestatusDTo);
            if (!result) {
                throw new common_1.NotFoundException("Ops this command not found");
            }
            return result;
        }
        catch (e) {
            console.log("there's a problem oooo", e);
            if (e instanceof common_1.NotFoundException || e instanceof common_1.ForbiddenException || e instanceof common_1.BadRequestException || e instanceof common_1.UnauthorizedException) {
                throw e;
            }
            throw new common_1.BadRequestException("Ops Something went wrong");
        }
    }
    async updatepickUpDate(orderId, updatepickUpDateDTo, req) {
        try {
            let token = req.headers['authorization']?.split(" ")[1];
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            if (!infoUser) {
                throw new common_1.UnauthorizedException("Try to login again");
            }
            let result = await this.commandService.updateOrderpickUpDate(infoUser.id, orderId, updatepickUpDateDTo);
            if (!result) {
                throw new common_1.NotFoundException("Ops this command is not found");
            }
            return result;
        }
        catch (e) {
            console.log("there's a problem oooo", e);
            if (e instanceof common_1.NotFoundException || e instanceof common_1.ForbiddenException || e instanceof common_1.BadRequestException || e instanceof common_1.UnprocessableEntityException) {
                throw e;
            }
            throw new common_1.BadRequestException("Ops Something went wrong");
        }
    }
};
exports.CommandController = CommandController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Give the company the ability to add new order" }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'the response returns the details of the Order ',
        type: response_command_dto_1.default,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized error: the user is not logged in ',
        schema: {
            example: {
                statusCode: 401,
                message: "Try to login again",
                error: 'Unauthorized error',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 422,
        description: 'Validation error: the provided order data is invalid ',
        content: {
            'application/json': {
                examples: {
                    "Using advanced amount in paid or not paid cases": {
                        value: {
                            statusCode: 422,
                            message: "Ops you have to choose the situation of partially paid to be able to add advanced amount",
                            error: 'Unprocessable Entity',
                        }
                    },
                    "Invalid date": {
                        value: {
                            statusCode: 422,
                            message: "The delivery Date is not valid, you can't deliver in the past",
                            error: 'Unprocessable Entity',
                        }
                    },
                    "The Advanced amout is bigger than Price": {
                        value: {
                            statusCode: 422,
                            message: "The advanced amount of The order suppose to be less than the total price",
                            error: 'Unprocessable Entity',
                        }
                    },
                },
            },
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Conflict error: the qrcode supposes to be unique',
        schema: {
            example: {
                statusCode: 409,
                message: "this QRCode is used",
                error: 'Conflict error',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request: new exception',
        schema: {
            example: "Ops smth went wrong"
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Fobidden error: the user is not authorized to create and order due to his role',
        schema: {
            example: {
                statusCode: 403,
                message: "you are not allowed to add an Order, you have to have company role to do so",
                error: 'forbidden error',
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_command_dto_1.CreateCommandDto, Object]),
    __metadata("design:returntype", void 0)
], CommandController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':qrcode'),
    (0, swagger_1.ApiOperation)({ summary: "Once the code is scanned the ClientId should be added in database" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "the qr code is scanned successfully and the clientid is updated",
        type: "Hgdthhhej00",
        example: "Congratulation the qrCode has been scanned successfully"
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Fobidden error: the user h  as company role and is not allowed to scan the qr code',
        schema: {
            example: {
                statusCode: 403,
                message: "You can't scan this qrCode unless you have the client role",
                error: 'forbidden error',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized error: the user is not logged in ',
        schema: {
            example: {
                statusCode: 401,
                message: "Try to login again",
                error: 'Unauthorized error',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Not found error: the order is not found',
        schema: {
            example: {
                statusCode: 404,
                message: "The order is not found",
                error: 'Not found error'
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request: new exception',
        schema: {
            example: "Ops smth went wrong",
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Conflict Exexeption: the qrCode is already scanned',
        schema: {
            example: "The qrCode is already scanned",
        },
    }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('qrcode')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CommandController.prototype, "scanedUserId", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "The client or the company can check their orders" }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized error: the user is not logged in ',
        schema: {
            example: {
                statusCode: 401,
                message: "Try to login again",
                error: 'Unauthorized error',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request: new exception',
        schema: {
            example: "Try again",
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The client or the company could see their own orders',
        content: {
            'application/json': {
                examples: {
                    "There's some orders": {
                        value: [
                            {
                                "pickupDate": null,
                                "_id": "67c0091e832153d893519185",
                                "companyId": "67bca1a1b3c6a150efad2045",
                                "clientId": "67c000469ab780a55e027c96",
                                "situation": "تسبيق",
                                "status": "قيد الانتظار",
                                "advancedAmount": 2000,
                                "city": "rabat",
                                "price": 50000,
                                "images": [],
                                "deliveryDate": "2025-10-26T00:00:00.000Z",
                                "qrCodeUrl": "Hgdthej8900",
                                "__v": 0
                            },
                            {
                                "_id": "67c06fe41468ebe553a31fe5",
                                "companyId": "67bca1a1b3c6a150efad2045",
                                "clientId": "67c000469ab780a55e027c96",
                                "situation": "تسبيق",
                                "status": "قيد الانتظار",
                                "advancedAmount": 2000,
                                "city": "rabat",
                                "price": 70000,
                                "images": [],
                                "deliveryDate": "2025-10-29T00:00:00.000Z",
                                "pickupDate": null,
                                "qrCode": "Hgdthhhej00",
                                "__v": 0
                            }
                        ]
                    },
                    "there's no order": {
                        value: "No order found",
                    },
                },
            },
        }
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CommandController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: "The client or the company can see th details of their sepefic order" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The client or the company check the details of order successfully',
        type: response_command_dto_1.default
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request: new exception',
        content: {
            'application/json': {
                examples: {
                    "The id of an order is not valid mongodbId": {
                        value: {
                            "message": "The order Is is not valid, try with a valid order Id",
                            "error": "Bad Request",
                            "statusCode": 400
                        },
                    },
                    "Something happend that can crash the app": {
                        value: "Try again"
                    },
                },
            },
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Not found exception: the order is not found',
        schema: {
            example: {
                "message": "No order found",
                "error": "Not Found",
                "statusCode": 404
            }
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized error: the user is not logged in ',
        schema: {
            example: {
                statusCode: 401,
                message: "Try to login again",
                error: 'Unauthorized error',
            },
        },
    }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CommandController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: "The company owner can update his own order" }),
    (0, swagger_1.ApiBody)({
        type: response_command_dto_1.default,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "The company owner can update the order successfully",
        type: response_command_dto_1.default,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request: new exception',
        content: {
            'application/json': {
                examples: {
                    "The id of an order is not valid mongodbId": {
                        value: {
                            "message": "The order Is is not valid, try with a valid order Id",
                            "error": "Bad Request",
                            "statusCode": 400
                        },
                    },
                    "Something happend that can crash the app": {
                        value: "Try again"
                    },
                },
            },
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized error: the user is not logged in ',
        schema: {
            example: {
                statusCode: 401,
                message: "Try to login again",
                error: 'Unauthorized error',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Fobidden error: Only the company owner that has an order can update it',
        schema: {
            example: {
                statusCode: 403,
                message: "You are not allowed to update this oder",
                error: 'forbidden error',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Not found exception: the order not found',
        schema: {
            example: {
                "message": "Order Not found",
                "error": "Not Found",
                "statusCode": 404
            }
        },
    }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_command_dto_1.UpdateCommandDto, Object]),
    __metadata("design:returntype", void 0)
], CommandController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "The company order want to delete an order" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "The company owner deletes the order successfully",
        example: "The order was deleted successfully"
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized error: the user is not logged in ',
        schema: {
            example: {
                statusCode: 401,
                message: "Try to login again",
                error: 'Unauthorized error',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Fobidden error: Only the company owner that has an order can delete it',
        schema: {
            example: {
                statusCode: 403,
                message: "You can't delete this order",
                error: 'forbidden error',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Not found exception: the order not found',
        schema: {
            example: {
                "message": "Order Not found",
                "error": "Not Found",
                "statusCode": 404
            }
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request: new exception',
        content: {
            'application/json': {
                examples: {
                    "The id of an order is not valid mongodbId": {
                        value: {
                            "message": "The order Is is not valid, try with a valid order Id",
                            "error": "Bad Request",
                            "statusCode": 400
                        },
                    },
                    "Something happend that can crash the app": {
                        value: "Try again"
                    },
                },
            },
        }
    }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CommandController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('scan/:qrCode'),
    (0, swagger_1.ApiOperation)({ summary: 'Scan QR code and retrieve command details' }),
    (0, swagger_1.ApiParam)({ name: 'qrCode', description: 'The unique QR code string from the scanned code' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Command details retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Command not found',
        schema: {
            example: {
                message: "The order is not found",
                error: 'Not Found',
                statusCode: 404
            }
        }
    }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('qrCode')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CommandController.prototype, "scanQrCode", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "The company owner can change his order's status to Done and the client will get a notification related to this" }),
    (0, swagger_1.ApiBody)({
        type: update_status_command_dto_1.UpdateStatusCommandDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The company change the status successfully',
        type: reponse_update_status_command_dto_1.responseStatusDTO,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized error: the user is not logged in ',
        schema: {
            example: {
                statusCode: 401,
                message: "Try to login again",
                error: 'Unauthorized error',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Not found exception: the order not found',
        schema: {
            example: {
                "message": "Ops this command not found",
                "error": "Not Found",
                "statusCode": 404
            }
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request: new exception',
        content: {
            'application/json': {
                examples: {
                    "Wrong status": {
                        value: {
                            "message": [
                                "status must be one of the following values: ",
                                "The status must be one of the following: في طور الانجاز, جاهزة للتسليم, تم تسليم"
                            ],
                            "error": "Bad Request",
                            "statusCode": 400
                        },
                    },
                    "Something happend that can crash the app": {
                        value: "Ops Something went wrong"
                    },
                },
            },
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Fobidden error: The user should be the owner of this order to update it',
        schema: {
            example: {
                statusCode: 403,
                message: "You are not allowed to update this oder",
                error: 'forbidden error',
            },
        },
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)("status/:orderId"),
    __param(0, (0, common_1.Param)("orderId")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_status_command_dto_1.UpdateStatusCommandDto, Object]),
    __metadata("design:returntype", Promise)
], CommandController.prototype, "updateStatusToDone", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "The company owner can change his order's pickup date and once he done so the user will get a notification related to this" }),
    (0, swagger_1.ApiBody)({
        type: update_status_command_dto_1.UpdateStatusCommandDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The company change the pick up date successfully',
        type: reponse_update_status_command_dto_1.responseStatusDTO,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized error: the user is not logged in ',
        schema: {
            example: {
                statusCode: 401,
                message: "Try to login again",
                error: 'Unauthorized error',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Not found exception: the order not found',
        schema: {
            example: {
                "message": "Ops this command not found",
                "error": "Not Found",
                "statusCode": 404
            }
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request: new exception',
        content: {
            'application/json': {
                examples: {
                    "Wrong status": {
                        value: {
                            "message": [
                                "The date must be in the format YYYY-MM-DD",
                                "The date has be not empty and to  be on this format: YYYY-MM-DD"
                            ],
                            "error": "Bad Request",
                            "statusCode": 400
                        },
                    },
                    "Something happend that can crash the app": {
                        value: "Ops Something went wrong"
                    },
                },
            },
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Fobidden error: The user should be the owner of this order to update it',
        schema: {
            example: {
                statusCode: 403,
                message: "You are not allowed to update this oder",
                error: 'forbidden error',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 422,
        description: "The pickupdate is not valid, it shouldn't be in the past",
        schema: {
            example: {
                statusCode: 422,
                message: "The pickup Date is not valid, Please pick up another Date rather it's today or in the future",
                error: "Unprocessable Entity",
            },
        },
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)("pickup/:orderId"),
    __param(0, (0, common_1.Param)("orderId")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_pickup_date_command_dto_1.UpdatepickUpDateCommandDto, Object]),
    __metadata("design:returntype", Promise)
], CommandController.prototype, "updatepickUpDate", null);
exports.CommandController = CommandController = __decorate([
    (0, swagger_1.ApiTags)('Orders '),
    (0, common_1.Controller)('order'),
    __metadata("design:paramtypes", [command_service_1.CommandService])
], CommandController);
//# sourceMappingURL=command.controller.js.map