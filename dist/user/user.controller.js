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
const update_user_first_name_dto_1 = require("./dto/UpdatesDtos/update-user-first-name.dto");
const update_user_last_name_dto_1 = require("./dto/UpdatesDtos/update-user-last-name.dto");
const update_user_city_name_dto_1 = require("./dto/UpdatesDtos/update-user-city-name.dto");
const update_user_company_name_dto_1 = require("./dto/UpdatesDtos/update-user-company-name.dto");
const update_user_field_dto_1 = require("./dto/UpdatesDtos/update-user-field.dto");
const reponse_update_company_dto_1 = require("./dto/ResponseDto/reponse-update-company.dto");
const admin_role_guard_1 = require("./guards/admin-role.guard");
const update_pocket_dto_1 = require("./dto/UpdatesDtos/update-pocket.dto");
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
    async getAllCompanies() {
        try {
            let result = await this.userService.getAllCompanies();
            return result;
        }
        catch (e) {
            if (e instanceof common_1.NotFoundException || e instanceof common_1.UnauthorizedException || e instanceof jsonwebtoken_1.JsonWebTokenError) {
                throw e;
            }
            console.log("There's an error ", e);
            throw new common_1.BadRequestException("Ops try again");
        }
    }
    async getAllClients() {
        try {
            let result = await this.userService.getAllClients();
            return result;
        }
        catch (e) {
            if (e instanceof common_1.NotFoundException || e instanceof common_1.UnauthorizedException || e instanceof jsonwebtoken_1.JsonWebTokenError) {
                throw e;
            }
            console.log("There's an error ", e);
            throw new common_1.BadRequestException("Ops try again");
        }
    }
    async updatePocketBalance(companyId, updateBalance) {
        try {
            return await this.userService.updatePocketBalance(companyId, updateBalance);
        }
        catch (e) {
            if (e instanceof common_1.NotFoundException || e instanceof common_1.UnauthorizedException || e instanceof jsonwebtoken_1.JsonWebTokenError) {
                throw e;
            }
            console.log("There's an error ", e);
            throw new common_1.BadRequestException("Ops try again");
        }
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
                throw new common_1.UnauthorizedException("Try to login again");
            }
            throw new common_1.BadRequestException("try again");
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
                throw new common_1.UnauthorizedException("try to login again");
            if (e instanceof common_1.ForbiddenException) {
                throw new common_1.ForbiddenException("You are not allowed to update this oder");
            }
            throw new common_1.BadRequestException("Please try again");
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
    async updateFirstName(updateFirstName, req) {
        try {
            let token = req.headers['authorization']?.split(" ")[1];
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            if (!infoUser) {
                throw new common_1.UnauthorizedException("Try to login again");
            }
            let result = await this.userService.UpdateFirstName(infoUser.id, updateFirstName);
            return result;
        }
        catch (e) {
            if (e instanceof common_1.NotFoundException || e instanceof common_1.UnauthorizedException || e instanceof common_1.BadRequestException) {
                throw e;
            }
            if (e instanceof jsonwebtoken_1.JsonWebTokenError) {
                throw new common_1.UnauthorizedException("Try to login again");
            }
            console.log("There's an error :", e);
        }
    }
    async updateLastName(updateLastNameDto, req) {
        try {
            let token = req.headers['authorization']?.split(" ")[1];
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            if (!infoUser) {
                throw new common_1.UnauthorizedException("Try to login again");
            }
            let result = await this.userService.UpdateLastName(infoUser.id, updateLastNameDto);
            return result;
        }
        catch (e) {
            if (e instanceof common_1.NotFoundException || e instanceof common_1.UnauthorizedException || e instanceof common_1.BadRequestException) {
                throw e;
            }
            if (e instanceof jsonwebtoken_1.JsonWebTokenError) {
                return "JWT must be provided, try to login again";
            }
            console.log("There's an error :", e);
        }
    }
    async updateCityName(updateCityNameDto, req) {
        try {
            let token = req.headers['authorization']?.split(" ")[1];
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            if (!infoUser) {
                throw new common_1.UnauthorizedException("Try to login again");
            }
            let result = await this.userService.UpdateCityName(infoUser.id, updateCityNameDto);
            return result;
        }
        catch (e) {
            if (e instanceof common_1.NotFoundException || e instanceof common_1.UnauthorizedException || e instanceof common_1.BadRequestException) {
                throw e;
            }
            if (e instanceof jsonwebtoken_1.JsonWebTokenError) {
                return "JWT must be provided, try to login again";
            }
            console.log("There's an error :", e);
        }
    }
    async updatecompanyName(updateCompanyNameDto, req) {
        try {
            let token = req.headers['authorization']?.split(" ")[1];
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            if (!infoUser) {
                throw new common_1.UnauthorizedException("Try to login again");
            }
            let result = await this.userService.UpdateCompanyName(infoUser.id, updateCompanyNameDto);
            return result;
        }
        catch (e) {
            if (e instanceof common_1.NotFoundException || e instanceof common_1.UnauthorizedException || e instanceof common_1.BadRequestException) {
                throw e;
            }
            if (e instanceof jsonwebtoken_1.JsonWebTokenError) {
                return "JWT must be provided, try to login again";
            }
            console.log("There's an error :", e);
        }
    }
    async updateField(updateFieldDto, req) {
        try {
            let token = req.headers['authorization']?.split(" ")[1];
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            if (!infoUser) {
                throw new common_1.UnauthorizedException("Try to login again");
            }
            let result = await this.userService.UpdateField(infoUser.id, updateFieldDto);
            return result;
        }
        catch (e) {
            if (e instanceof common_1.NotFoundException || e instanceof common_1.UnauthorizedException || e instanceof common_1.BadRequestException) {
                throw e;
            }
            if (e instanceof jsonwebtoken_1.JsonWebTokenError) {
                return "JWT must be provided, try to login again";
            }
            console.log("There's an error :", e);
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
    (0, swagger_1.ApiOperation)({ summary: 'the admin can preview all the users info' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'the response returns the info of companies',
        content: {
            'application/json': {
                examples: {
                    "Info of companies": {
                        value: [{
                                "pocket": 250,
                                "_id": "68189f73271ae1b74abf888e",
                                "Fname": "Salima BHMD",
                                "Lname": "company",
                                "companyName": null,
                                "role": "company",
                                "phoneNumber": "+212698888311",
                                "password": "$2b$10$12L4nfRf65G72im3xw/z.eIjqOZB/y/XCxUN9QKePoA2MNKPWsNyG",
                                "city": "rabat",
                                "field": "pressing",
                                "ice": 0,
                                "ownRef": "C79D568E",
                                "listRefs": [],
                                "createdAt": "2025-05-05T11:22:27.314Z",
                                "updatedAt": "2025-05-05T11:22:27.314Z",
                                "__v": 0
                            }],
                    },
                },
            },
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized error: the admin should be authentificated',
        schema: {
            example: {
                "message": 'kindly try to login again',
                "error": "Unauthorized",
                "statusCode": 401
            }
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden error: Only users who have admin role can access to this route',
        schema: {
            example: {
                "message": 'Osp only admins can access to this route',
                "error": "Forbidden",
                "statusCode": 403
            }
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad error : something breaks down',
        schema: {
            example: {
                "message": "Ops try again",
                "error": "Bad Request Exception",
                "statusCode": 400
            }
        },
    }),
    (0, common_1.Get)("companies"),
    (0, common_1.UseGuards)(admin_role_guard_1.AdminRoleGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllCompanies", null);
__decorate([
    (0, common_1.Get)("clients"),
    (0, common_1.UseGuards)(admin_role_guard_1.AdminRoleGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllClients", null);
__decorate([
    (0, common_1.Patch)('pocket/:companyId'),
    (0, common_1.UseGuards)(admin_role_guard_1.AdminRoleGuard),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_pocket_dto_1.UpdatePocketBalance]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePocketBalance", null);
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
                "message": "try again",
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
                "message": "The account not found",
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
        example: "The account was deleted successfully"
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad error : something breaks down',
        schema: {
            example: {
                "message": "try again",
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
                message: "The account not found",
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
                message: "the user not found ",
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
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "This method allows users to change their first names" }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBody)({
        type: update_user_first_name_dto_1.UpdateFirstNameDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'the first name provided is valid and the user updates it successfully',
        type: reponse_update_company_dto_1.ResoponseUpdateCompanyDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Something went wrong',
        content: {
            'application/json': {
                examples: {
                    "Something went wrong": {
                        value: {
                            message: "Ops, the user's first name didn't update",
                            error: 'Bad Request Exception',
                            statusCode: 400,
                        }
                    },
                    "Empty body without First name": {
                        value: {
                            "message": [
                                "the first name is required and shouldn't be empty",
                                "The first name should be string"
                            ],
                            "error": "Bad Request",
                            "statusCode": 400
                        }
                    },
                }
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or expired token',
        schema: {
            example: {
                message: "Try to login again",
                error: 'Unauthorized',
                statusCode: 401,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Not found - User not found',
        schema: {
            example: {
                message: "The user not found, Try again",
                error: 'NotFount',
                statusCode: 404,
            },
        },
    }),
    (0, common_1.Patch)("firstname"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_first_name_dto_1.UpdateFirstNameDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateFirstName", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "This method allows users to change their last names" }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBody)({
        type: update_user_last_name_dto_1.UpdateLastNameDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'the last name provided is valid and the user updates it successfully',
        type: reponse_update_company_dto_1.ResoponseUpdateCompanyDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Something went wrong',
        content: {
            'application/json': {
                examples: {
                    "Something went wrong": {
                        value: {
                            message: "Ops, the user's last name didn't update",
                            error: 'Bad Request Exception',
                            statusCode: 400,
                        }
                    },
                    "Last name is required but not available": {
                        value: {
                            "message": [
                                "the last name is required and shouldn't be empty",
                                "The last name should be string"
                            ],
                            "error": "Bad Request",
                            "statusCode": 400
                        }
                    },
                }
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or expired token',
        schema: {
            example: {
                message: "Try to login again",
                error: 'Unauthorized',
                statusCode: 401,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Not found - User not found',
        schema: {
            example: {
                message: "The user not found, Try again",
                error: 'NotFount',
                statusCode: 404,
            },
        },
    }),
    (0, common_1.Patch)("lastname"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_last_name_dto_1.UpdateLastNameDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateLastName", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "This method allows users to change their cities" }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBody)({
        type: update_user_city_name_dto_1.UpdateCityDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The city provided is valid and the user updates it successfully',
        type: reponse_update_company_dto_1.ResoponseUpdateCompanyDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Something went wrong',
        content: {
            'application/json': {
                examples: {
                    "Something went wrong": {
                        value: {
                            message: "Ops, the user's city didn't update",
                            error: 'Bad Request Exception',
                            statusCode: 400,
                        }
                    },
                    "City is not sent or not string": {
                        value: {
                            "message": [
                                "the City is required and shouldn't be empty",
                                "The City should be string"
                            ],
                            "error": "Bad Request",
                            "statusCode": 400
                        }
                    },
                }
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or expired token',
        schema: {
            example: {
                message: "Try to login again",
                error: 'Unauthorized',
                statusCode: 401,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Not found - User not found',
        schema: {
            example: {
                message: "The user not found, Try again",
                error: 'NotFount',
                statusCode: 404,
            },
        },
    }),
    (0, common_1.Patch)("city"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_city_name_dto_1.UpdateCityDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateCityName", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "This method allows users to change their companies name" }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBody)({
        type: update_user_company_name_dto_1.UpdateCompanyNameDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The company name provided is valid and the user updates it successfully',
        type: reponse_update_company_dto_1.ResoponseUpdateCompanyDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Something went wrong',
        content: {
            'application/json': {
                examples: {
                    "Something went wrong": {
                        value: {
                            message: "Ops, the user's company name didn't update",
                            error: 'Bad Request Exception',
                            statusCode: 400,
                        }
                    },
                    "Company name is not sent or its format not string": {
                        value: {
                            "message": [
                                "The company name can not be empty",
                                "The company name should be string"
                            ],
                            "error": "Bad Request",
                            "statusCode": 400
                        }
                    },
                }
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or expired token',
        schema: {
            example: {
                message: "Try to login again",
                error: 'Unauthorized',
                statusCode: 401,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Not found - User not found',
        schema: {
            example: {
                message: "The user not found, Try again",
                error: 'NotFount',
                statusCode: 404,
            },
        },
    }),
    (0, common_1.Patch)("companyname"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_company_name_dto_1.UpdateCompanyNameDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatecompanyName", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "This method allows users to change their field" }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBody)({
        type: update_user_field_dto_1.UpdateFieldDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The Field provided is valid and the user updates it successfully',
        type: reponse_update_company_dto_1.ResoponseUpdateCompanyDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Something went wrong',
        content: {
            'application/json': {
                examples: {
                    "Something went wrong": {
                        value: {
                            message: "Ops, the user's field didn't update",
                            error: 'Bad Request Exception',
                            statusCode: 400,
                        }
                    },
                    "Field is not sent or its format not string": {
                        value: {
                            "message": [
                                "the field should not be empty",
                                "The field should be string"
                            ],
                            "error": "Bad Request",
                            "statusCode": 400
                        }
                    },
                }
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or expired token',
        schema: {
            example: {
                message: "Try to login again",
                error: 'Unauthorized',
                statusCode: 401,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Not found - User not found',
        schema: {
            example: {
                message: "The user not found, Try again",
                error: 'Not Found',
                statusCode: 404,
            },
        },
    }),
    (0, common_1.Patch)("field"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_field_dto_1.UpdateFieldDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateField", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map