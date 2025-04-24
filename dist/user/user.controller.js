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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const login_user_dto_1 = require("./dto/Logindto/login-user.dto");
const verifyJwt_1 = require("../services/verifyJwt");
const jsonwebtoken_1 = require("jsonwebtoken");
const swagger_1 = require("@nestjs/swagger");
const VerifyPhoneNumber_dto_1 = require("./dto/Logindto/VerifyPhoneNumber.dto");
(0, swagger_1.ApiTags)('User');
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async register(CreateUserDto) {
        return this.userService.register(CreateUserDto);
    }
    async login(LoginUserDto) {
        return this.userService.login(LoginUserDto);
    }
    findOne(id, req) {
        try {
            let token = req.headers['authorization']?.split(" ")[1];
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            if (!infoUser) {
                throw new common_1.UnauthorizedException("Try to login again");
            }
            return this.userService.findOne(id);
        }
        catch (e) {
            console.log("there's an error", e);
            if (e instanceof jsonwebtoken_1.JsonWebTokenError || e instanceof jsonwebtoken_1.TokenExpiredError) {
                throw new common_1.UnauthorizedException("حاول تسجل ف الحساب ديالك مرة أخرى");
            }
            throw new common_1.BadRequestException("حاول مرة أخرى");
        }
    }
    deleteAccount(id, req) {
        try {
            let token = req.headers['authorization']?.split(" ")[1];
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            if (!infoUser) {
                throw new common_1.UnauthorizedException("Try to login again");
            }
            return this.userService.deleteAccount(id, infoUser.id);
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
    updateUserProfile(id, updateUserDto, req) {
        try {
            let token = req.headers['authorization']?.split(" ")[1];
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            if (!infoUser) {
                throw new common_1.UnauthorizedException("Try to login again");
            }
            if (id !== infoUser.id) {
                throw new common_1.ForbiddenException("You are not allowed to update this oder");
            }
            return this.userService.updateUserInfo(id, updateUserDto);
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
    async verifyPhone(verifyNumberDto) {
        try {
            return this.userService.VerifyNumber(verifyNumberDto.phoneNumber, verifyNumberDto);
        }
        catch (e) {
            console.log(e);
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: "The user is on the phase one of registration" }),
    (0, swagger_1.ApiBody)({
        type: create_user_dto_1.CreateUserDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "The user register his account successfully",
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "the user uses an existing number to register or an exception happend",
        content: {
            'application/json': {
                examples: {
                    'Using an existing number ': {
                        value: {
                            "message": "This number is already used, try to login or use another one",
                            "error": "Bad Request",
                            "statusCode": 400
                        }
                    },
                    'Failed registration for an Exception': {
                        value: {
                            "message": 'Registration failed',
                            "error": "Bad Request",
                            "statusCode": 400
                        }
                    }
                }
            }
        }
    }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: "The user is logged in" }),
    (0, swagger_1.ApiBody)({
        type: login_user_dto_1.LoginUserDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "The user logged in to his account successfully",
        content: {
            'application/json': {
                example: {
                    "message": "Login successful",
                    "userinfo": {
                        "_id": "67c59c87de812842786ca354",
                        "phoneNumber": "+212697042835",
                        "role": "company",
                        "isVerified": true,
                        "fullAddress": "Rabat jump it",
                        "field": "خياط",
                        "ice": 78287383792883820,
                        "name": "Company user test"
                    },
                    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YzU5Yzg3ZGU4MTI4NDI3ODZjYTM1NCIsInBob25lTnVtYmVyIjoiKzIxMjY5NzA0MjgzNSIsInJvbGUiOiJjb21wYW55IiwiaWF0IjoxNzQxMTgzMzExLCJleHAiOjE3NDExODY5MTF9.O59zUgikxMKumXe3tJPsyTGlk939p8IVwCwRh8mzdfw"
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "the user uses invalid number or an exception happend",
        content: {
            'application/json': {
                examples: {
                    "Using a number that's not registered": {
                        value: {
                            "message": "This User Does not exists",
                            "error": "Bad Request",
                            "statusCode": 400
                        }
                    },
                    'Password is incorrect': {
                        value: {
                            "message": "Password incorrect",
                            "error": "Bad Request",
                            "statusCode": 400
                        },
                    },
                    'Phonenumber is not verified': {
                        value: {
                            "message": "Phone number not verified",
                            "error": "Bad Request",
                            "statusCode": 400
                        }
                    },
                    'other Exceptions ': {
                        value: {
                            "message": "There was an error while login",
                            "error": "Bad Request",
                            "statusCode": 400
                        }
                    }
                }
            }
        }
    }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'the user or the company owner can preview their own informations' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'the response returns the info of user ',
        content: {
            'application/json': {
                examples: {
                    "Info of user ": {
                        value: {
                            "name": "client user test",
                            "phoneNumber": "+2126970428355",
                            "role": "client"
                        }
                    },
                    "Info of company owner": {
                        value: {
                            "name": "Company user test",
                            "phoneNumber": "+212697042835",
                            "fullAddress": "Rabat jump it",
                            "field": "خياط",
                            "ice": 78287383792883820,
                            "role": "company"
                        },
                    },
                },
            },
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized error: the user should login again using his phone number and password to continue filling his informations',
        schema: {
            example: {
                "message": "حاول تسجل ف الحساب ديالك مرة أخرى",
                "error": "Unauthorized",
                "statusCode": 401
            }
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad error : something breaks down',
        schema: {
            example: {
                "message": "حاول مرة أخرى",
                "error": "Bad Request Exception",
                "statusCode": 400
            }
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Not found exception : the info of user not found',
        schema: {
            example: {
                "message": "حساب مكاينش، حاول مرة أخرى",
                "error": "Not found",
                "statusCode": 404
            }
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "the user or the company owner delete his account " }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "The user or the company owner deletes his account successfully",
        example: "تم مسح الحساب بنجاح"
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad error : something breaks down',
        schema: {
            example: {
                "message": "حاول مرة أخرى",
                "error": "Bad Request Exception",
                "statusCode": 400
            }
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized error: the user should login again using his phone number and password to continue filling his informations',
        schema: {
            example: {
                "message": "Try to login again",
                "error": "Unauthorized",
                "statusCode": 401
            }
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "deleteAccount", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Update user profile information" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "User profile updated successfully",
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Bad request - Invalid data provided",
        schema: {
            example: {
                message: "تعذر تحديث الملف الشخصي",
                error: "Bad Request",
                statusCode: 400
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: "Unauthorized - Invalid or expired token",
        schema: {
            example: {
                message: "Try to login again",
                error: "Unauthorized",
                statusCode: 401
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: "Forbidden - User doesn't have permission to update this profile",
        schema: {
            example: {
                message: "You are not allowed to update this oder",
                error: "Forbidden",
                statusCode: 403
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: "Not Found - User not found",
        schema: {
            example: {
                message: "المستخدم غير موجود",
                error: "Not Found",
                statusCode: 404
            }
        }
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "updateUserProfile", null);
__decorate([
    (0, common_1.Post)("verifyNumber"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Phone number is valid',
        schema: {
            example: {
                statusCode: 200,
                message: 'Phone number is valid',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid data provided',
        schema: {
            example: {
                message: 'Validation failed: Phone number must be in international format (e.g., +212697042868)',
                error: 'Bad Request',
                statusCode: 400,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or expired token',
        schema: {
            example: {
                message: 'حاول تسجل مرة أخرى',
                error: 'Unauthorized',
                statusCode: 401,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: ' Invalid User',
        schema: {
            example: {
                message: 'المستخدم غير موجود',
                error: 'Not Found',
                statusCode: 404,
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VerifyPhoneNumber_dto_1.VerifyNumberDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "verifyPhone", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map