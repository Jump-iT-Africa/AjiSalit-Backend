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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./entities/user.schema");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcrypt");
const class_transformer_1 = require("class-transformer");
const response_company_dto_1 = require("./dto/ResponseDto/response-company.dto");
const response_user_dto_1 = require("./dto/ResponseDto/response-user.dto");
const response_login_dto_1 = require("./dto/ResponseDto/response-login.dto");
const crypto = require("crypto");
const class_validator_1 = require("class-validator");
const VerifyPhoneNumber_dto_1 = require("./dto/Logindto/VerifyPhoneNumber.dto");
const secretKey = process.env.JWT_SECRET;
let UserService = class UserService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async register(createUserDto) {
        try {
            const { name, phoneNumber, role, password, city, field, ice, ownRef, refBy, listRefs } = createUserDto;
            const existingUser = await this.userModel.findOne({ phoneNumber }).exec();
            if (existingUser) {
                return {
                    message: 'هاد الرقم مستعمل من قبل جرب رقم أخر'
                };
            }
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const GeneratedRefCode = this.generateReferralCode();
            const newUser = new this.userModel({
                name,
                phoneNumber,
                role,
                password: hashedPassword,
                city,
                field,
                ice,
                ownRef: GeneratedRefCode,
                refBy,
                listRefs: listRefs || []
            });
            const savedUser = await newUser.save();
            if (refBy) {
                const referrer = await this.userModel.findOne({ ownRef: refBy }).exec();
                if (referrer) {
                    await this.userModel.findByIdAndUpdate(referrer._id, { $push: { listRefs: savedUser._id.toString() } }, { new: true });
                }
            }
            const payload = {
                id: savedUser._id,
                name: savedUser.name,
                phoneNumber: savedUser.phoneNumber,
                role: savedUser.role,
                city: savedUser.city,
                field: savedUser.field,
                ice: savedUser.ice,
                ownRef: savedUser.ownRef,
                listRefs: savedUser.listRefs
            };
            const token = jwt.sign(payload, secretKey, { expiresIn: '30d' });
            return {
                user: payload,
                token,
            };
        }
        catch (error) {
            console.error('Registration error:', error);
            return {
                ErrorMessage: error
            };
        }
    }
    generateReferralCode() {
        return crypto.randomBytes(4).toString('hex').toUpperCase();
    }
    async login(LoginUserDto) {
        const { phoneNumber, password } = LoginUserDto;
        const User = await this.userModel.findOne({ phoneNumber }).exec();
        if (!User) {
            throw new common_1.BadRequestException("This User Does not exists");
        }
        const isPasswordValid = await bcrypt.compare(password, User.password);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Password incorrect');
        }
        try {
            const token = jwt.sign({
                id: User._id,
                phoneNumber: User.phoneNumber,
                username: User.name,
                city: User.city,
                field: User.field,
                ice: User.ice,
                role: User.role,
            }, secretKey, { expiresIn: '30d' });
            let userinfo = (0, class_transformer_1.plainToClass)(response_login_dto_1.ResponseLoginDto, User, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true
            });
            return {
                message: 'Login successful',
                userinfo,
                token,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException("There was an error while login");
        }
    }
    async updateAuthentifictaion(id, updateDto, authentificatedId) {
        try {
            console.log("hello from service ,", updateDto);
            let result = await this.userModel.findById(id).exec();
            if (!result) {
                throw new common_1.NotFoundException("حاول دخل رقم ديالك مرة أخرى");
            }
            if (authentificatedId !== result._id.toString()) {
                throw new common_1.ForbiddenException("ممسموحش لك");
            }
            const updateAuthentificator = await this.userModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
            return "تم إنشاء حسابك بنجاح";
        }
        catch (e) {
            console.log(e);
            throw new common_1.BadRequestException("حاول مرة أخرى");
        }
    }
    findAll() {
        return `This action returns all users`;
    }
    async findOne(id) {
        try {
            let result = await this.userModel.findById(id).exec();
            if (!result) {
                throw new common_1.NotFoundException("حساب مكاينش، حاول مرة أخرى");
            }
            if (result.role == "company") {
                let data = (0, class_transformer_1.plainToClass)(response_company_dto_1.ResoponseCompanyDto, result, {
                    excludeExtraneousValues: true,
                    enableImplicitConversion: true
                });
                return data;
            }
            else if (result.role == "client") {
                let data = (0, class_transformer_1.plainToClass)(response_user_dto_1.ResponseUserDto, result, {
                    excludeExtraneousValues: true,
                    enableImplicitConversion: true
                });
                return data;
            }
        }
        catch (e) {
            console.log("there's an error", e);
            if (e instanceof common_1.NotFoundException) {
                throw new common_1.NotFoundException("حساب مكاينش، حاول مرة أخرى");
            }
            throw new common_1.BadRequestException("حاول مرة أخرى");
        }
    }
    update(id, updateDto) {
        return `This action updates a #${id} user`;
    }
    async deleteAccount(id, userId) {
        try {
            let account = await this.userModel.findById(id);
            if (!account) {
                throw new common_1.NotFoundException("الحساب ديالك مكاينش");
            }
            if (account._id.toString() !== userId) {
                throw new common_1.ForbiddenException("ممسموحش لك تمسح هاد الحساب");
            }
            let deleteAccount = await this.userModel.findByIdAndDelete(id).exec();
            return "تم مسح الحساب بنجاح";
        }
        catch (e) {
            if (e instanceof jwt.JsonWebTokenError || e instanceof jwt.TokenExpiredError)
                throw new common_1.UnauthorizedException("حاول تسجل مرة أخرى");
            if (e instanceof common_1.ForbiddenException) {
                throw new common_1.ForbiddenException("ممسموحش لك تبدل هاد طلب");
            }
            throw new common_1.BadRequestException("حاول مرة خرى");
        }
    }
    async updateUserInfo(id, updateUserDto) {
        try {
            const toUpdate = await this.userModel.findById(id);
            if (!toUpdate) {
                throw new common_1.NotFoundException('المستخدم غير موجود');
            }
            const originalRefBy = toUpdate.refBy;
            delete updateUserDto.password;
            delete updateUserDto.ownRef;
            const newRefBy = updateUserDto.refBy;
            if (newRefBy && newRefBy !== originalRefBy) {
                const newReferrer = await this.userModel.findOne({ ownRef: newRefBy }).exec();
                if (newReferrer) {
                    await this.userModel.findByIdAndUpdate(newReferrer._id, { $addToSet: { listRefs: id } }, { new: true });
                }
                if (originalRefBy) {
                    const originalReferrer = await this.userModel.findOne({ ownRef: originalRefBy }).exec();
                    if (originalReferrer) {
                        await this.userModel.findByIdAndUpdate(originalReferrer._id, { $pull: { listRefs: id } }, { new: true });
                    }
                }
            }
            Object.assign(toUpdate, updateUserDto);
            await toUpdate.save();
            return toUpdate;
        }
        catch (error) {
            console.error("Error updating user profile:", error);
            throw new common_1.BadRequestException('تعذر تحديث الملف الشخصي');
        }
    }
    async VerifyNumber(phoneNumber, verifyNumberDto) {
        try {
            const dtoInstance = (0, class_transformer_1.plainToInstance)(VerifyPhoneNumber_dto_1.VerifyNumberDto, verifyNumberDto);
            const errors = await (0, class_validator_1.validate)(dtoInstance);
            if (errors.length > 0) {
                const validationErrors = errors.map(err => Object.values(err.constraints)).join(', ');
                throw new common_1.BadRequestException(`Validation failed: ${validationErrors}`);
            }
            const user = await this.userModel.findOne({ phoneNumber }).exec();
            console.log(user);
            if (user) {
                return {
                    statusCode: 409,
                    message: 'Phone number already exists',
                };
            }
            else {
                return {
                    statusCode: 200,
                    message: 'Phone number is valid',
                };
            }
        }
        catch (error) {
            console.error(error);
            throw new common_1.BadRequestException({
                statusCode: 400,
                message: 'There was an unexpected error',
                error: error.message || error,
            });
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserService);
//# sourceMappingURL=user.service.js.map