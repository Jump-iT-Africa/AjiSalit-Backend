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
const signInToApp_dto_1 = require("./dto/Logindto/signInToApp.dto");
const verifyJwt_1 = require("../services/verifyJwt");
const jsonwebtoken_1 = require("jsonwebtoken");
const RoleValidationPipe_1 = require("./pipes/RoleValidationPipe");
const swagger_1 = require("@nestjs/swagger");
(0, swagger_1.ApiTags)('User');
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    signInToApp(signInToAppDto) {
        return this.userService.signInToApp(signInToAppDto);
    }
    async register(CreateUserDto) {
        return this.userService.register(CreateUserDto);
    }
    async verifyOTP(phoneNumber, otp) {
        return this.userService.verifyOTP(phoneNumber, otp);
    }
    async login(LoginUserDto) {
        return this.userService.login(LoginUserDto);
    }
    async updateAuthentifictaion(id, updateDto, req) {
        try {
            let token = req.headers['authorization'];
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            if (!infoUser) {
                throw new common_1.UnauthorizedException("حاول تسجل مرة أخرى");
            }
            if (!updateDto) {
                return "خصك تعمر المعلومات ديالك";
            }
            return this.userService.updateAuthentifictaion(id, updateDto, infoUser.id);
        }
        catch (e) {
            console.log("there's an error", e);
            if (e instanceof jsonwebtoken_1.JsonWebTokenError || e instanceof jsonwebtoken_1.TokenExpiredError) {
                throw new common_1.UnauthorizedException("حاول تسجل ف الحساب ديالك مرة أخرى");
            }
            throw new common_1.BadRequestException("حاول مرة أخرى");
        }
    }
    findAll() {
        return this.userService.findAll();
    }
    findOne(id, req) {
        try {
            let token = req.headers['authorization'];
            let infoUser = (0, verifyJwt_1.validateJwt)(token);
            if (!infoUser) {
                throw new common_1.UnauthorizedException("حاول تسجل مرة أخرى");
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
    update(id, updateUserDto) {
        return this.userService.update(id, updateUserDto);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('signin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signInToApp_dto_1.SignInToAppDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "signInToApp", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('verify'),
    __param(0, (0, common_1.Body)('phoneNumber')),
    __param(1, (0, common_1.Body)('otp')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "verifyOTP", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: "The user has to update his information for the first time in order to finish his authentification" }),
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
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)(new RoleValidationPipe_1.RoleValidationPipe())),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateAuthentifictaion", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "update", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map