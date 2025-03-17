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
                throw new common_1.UnauthorizedException("حاول تسجل مرة أخرى");
            }
            if (infoUser.role !== "company") {
                throw new common_1.ForbiddenException("ممسموحش لك تزيد طلب");
            }
            const authentificatedId = infoUser.id;
            return this.commandService.create(createCommandDto, authentificatedId);
        }
        catch (e) {
            if (e instanceof jsonwebtoken_1.JsonWebTokenError)
                throw new common_1.UnauthorizedException("حاول تسجل مرة أخرى");
            if (e instanceof common_1.ForbiddenException) {
                throw new common_1.ForbiddenException("ممسموحش لك تزيد طلب");
            }
            throw new common_1.BadRequestException('Ops smth went wrong', e);
        }
    }
    scanedUserId(qrcode, req) {
        try {
            let token = req.headers['authorization'].split(" ")[1];
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            if (!infoUser) {
                throw new common_1.UnauthorizedException("حاول تسجل مرة أخرى");
            }
            if (infoUser.role !== "client" && infoUser.role !== "admin") {
                throw new common_1.ForbiddenException("ممسموحش لك مسح QR هاد الخاصية غير المستعملين العاديين");
            }
            return this.commandService.scanedUserId(qrcode, infoUser.id);
        }
        catch (e) {
            if (e instanceof common_1.ForbiddenException) {
                throw new common_1.ForbiddenException("ممسموحش لك مسح QR هاد الخاصية غير المستعملين العاديين");
            }
            if (e instanceof jsonwebtoken_1.JsonWebTokenError || e instanceof jsonwebtoken_1.TokenExpiredError)
                throw new common_1.UnauthorizedException("حاول تسجل مرة أخرى");
            throw new common_1.BadRequestException("ops smth went wrong");
        }
    }
    findAll(req) {
        try {
            let token = req.headers['authorization'].split(" ")[1];
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            console.log(infoUser);
            if (!infoUser) {
                throw new common_1.UnauthorizedException("حاول تسجل مرة أخرى");
            }
            return this.commandService.findAll(infoUser.id, infoUser.role);
        }
        catch (e) {
            console.log(e);
            if (e instanceof jsonwebtoken_1.JsonWebTokenError || e instanceof jsonwebtoken_1.TokenExpiredError)
                throw new common_1.UnauthorizedException("حاول تسجل مرة أخرى");
            throw new common_1.BadRequestException("حاول مرة خرى");
        }
    }
    findOne(id, req) {
        try {
            let token = req.headers['authorization'].split(" ")[1];
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            console.log(infoUser);
            if (!infoUser) {
                throw new common_1.UnauthorizedException("حاول تسجل مرة أخرى");
            }
            return this.commandService.findOne(id, infoUser);
        }
        catch (e) {
            if (e instanceof jsonwebtoken_1.JsonWebTokenError || e instanceof jsonwebtoken_1.TokenExpiredError)
                throw new common_1.UnauthorizedException("حاول تسجل مرة أخرى");
            throw new common_1.BadRequestException("حاول مرة خرى");
        }
    }
    update(id, updateCommandDto, req) {
        try {
            let token = req.headers['authorization'].split(" ")[1];
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            if (!infoUser) {
                throw new common_1.UnauthorizedException("حاول تسجل مرة أخرى");
            }
            if (infoUser.role !== "company") {
                throw new common_1.ForbiddenException("ممسموحش لك تبدل هاد طلب");
            }
            return this.commandService.update(infoUser.id, id, updateCommandDto);
        }
        catch (e) {
            console.log(e);
            if (e instanceof jsonwebtoken_1.JsonWebTokenError || e instanceof jsonwebtoken_1.TokenExpiredError)
                throw new common_1.UnauthorizedException("حاول تسجل مرة أخرى");
            if (e instanceof common_1.ForbiddenException) {
                throw new common_1.ForbiddenException("ممسموحش لك تبدل هاد طلب");
            }
            throw new common_1.BadRequestException("حاول مرة خرى");
        }
    }
    remove(id, req) {
        try {
            let token = req.headers['authorization'].split(" ")[1];
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            if (!infoUser) {
                throw new common_1.UnauthorizedException("حاول تسجل مرة أخرى");
            }
            if (infoUser.role !== "company") {
                throw new common_1.ForbiddenException("ممسموحش لك تمسح هاد طلب");
            }
            return this.commandService.deleteOrder(id, infoUser.id);
        }
        catch (e) {
            console.log(e);
            if (e instanceof jsonwebtoken_1.JsonWebTokenError || e instanceof jsonwebtoken_1.TokenExpiredError)
                throw new common_1.UnauthorizedException("حاول تسجل مرة أخرى");
            if (e instanceof common_1.ForbiddenException) {
                throw new common_1.ForbiddenException("ممسموحش لك تبدل هاد طلب");
            }
            throw new common_1.BadRequestException("حاول مرة خرى");
        }
    }
    async scanQrCode(qrCode, req) {
        try {
            let token = req.headers['authorization'].split(" ")[1];
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            if (!infoUser) {
                throw new common_1.UnauthorizedException("حاول تسجل مرة أخرى");
            }
            return this.commandService.getCommandByQrCode(qrCode);
        }
        catch (e) {
            console.log(e);
            if (e instanceof jsonwebtoken_1.JsonWebTokenError || e instanceof jsonwebtoken_1.TokenExpiredError)
                throw new common_1.UnauthorizedException("حاول تسجل مرة أخرى");
            if (e instanceof common_1.ForbiddenException) {
                throw new common_1.ForbiddenException("ممسموحش لك تبدل هاد طلب");
            }
            throw new common_1.BadRequestException("حاول مرة خرى");
        }
    }
};
exports.CommandController = CommandController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Give the company the ability to add new order" }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'the response returns the details of the Order ',
        type: response_command_dto_1.default,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized error: the user is not logged in ',
        schema: {
            example: {
                statusCode: 401,
                message: "حاول تسجل مرة أخرى",
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
                            message: "تأكد من الحالة، مبلغ ديال تسبيق كيتستعمل غير فحالة التسبيق",
                            error: 'Unprocessable Entity',
                        }
                    },
                    "Invalid date": {
                        value: {
                            statusCode: 422,
                            message: "تاريخ ماشي صحيح تأكد مرة أخرى",
                            error: 'Unprocessable Entity',
                        }
                    },
                    "The Advanced amout is bigger than Price": {
                        value: {
                            statusCode: 422,
                            message: "مبلغ التسبيق خاص اكون صغر من المبلغ الاجمالي، تأكد مرة أخرى",
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
                message: "هاد الكود مستعمل",
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
                message: "ممسموحش لك تزيد طلب",
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
        example: "مبروك تم مسح رمز بنجاح"
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Fobidden error: the user has company role and is not allowed to scan the qr code',
        schema: {
            example: {
                statusCode: 403,
                message: "ممسموحش لك مسح QR هاد الخاصية غير المستعملين العاديين",
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
                message: "حاول تسجل مرة أخرى",
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
                message: "طلب مكاينش تأكد من رمز مرة أخرى",
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
                message: "حاول تسجل مرة أخرى",
                error: 'Unauthorized error',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request: new exception',
        schema: {
            example: "حاول مرة خرى",
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
                        value: "ماكين حتا طلب",
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
                            "message": "رقم ديال طلب خطء حاول مرة أخرى",
                            "error": "Bad Request",
                            "statusCode": 400
                        },
                    },
                    "Something happend that can crash the app": {
                        value: "حاول مرة خرى"
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
                "message": "ماكين حتا طلب",
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
                message: "حاول تسجل مرة أخرى",
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
                            "message": "رقم ديال طلب خطء حاول مرة أخرى",
                            "error": "Bad Request",
                            "statusCode": 400
                        },
                    },
                    "Something happend that can crash the app": {
                        value: "حاول مرة خرى"
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
                message: "حاول تسجل مرة أخرى",
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
                message: "ممسموحش لك تبدل هاد طلب",
                error: 'forbidden error',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Not found exception: the order not found',
        schema: {
            example: {
                "message": "طلب ديالك مكاينش",
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
        example: "تم مسح طلب بنجاح"
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized error: the user is not logged in ',
        schema: {
            example: {
                statusCode: 401,
                message: "حاول تسجل مرة أخرى",
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
                message: "ممسموحش لك تمسح هاد طلب",
                error: 'forbidden error',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Not found exception: the order not found',
        schema: {
            example: {
                "message": "طلب ديالك مكاينش",
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
                            "message": "رقم ديال طلب خطء حاول مرة أخرى",
                            "error": "Bad Request",
                            "statusCode": 400
                        },
                    },
                    "Something happend that can crash the app": {
                        value: "حاول مرة خرى"
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
                message: 'لم يتم العثور على الطلب',
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
exports.CommandController = CommandController = __decorate([
    (0, swagger_1.ApiTags)('Orders '),
    (0, common_1.Controller)('order'),
    __metadata("design:paramtypes", [command_service_1.CommandService])
], CommandController);
//# sourceMappingURL=command.controller.js.map