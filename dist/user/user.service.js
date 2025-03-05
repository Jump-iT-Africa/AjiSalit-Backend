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
const twilio_service_1 = require("../services/twilio.service");
const class_transformer_1 = require("class-transformer");
const response_company_dto_1 = require("./dto/ResponseDto/response-company.dto");
const response_user_dto_1 = require("./dto/ResponseDto/response-user.dto");
let UserService = class UserService {
    constructor(userModel, twilioService) {
        this.userModel = userModel;
        this.twilioService = twilioService;
    }
    async signInToApp(signInToAppDto) {
        try {
            const { phoneNumber } = signInToAppDto;
            const existingUser = await this.userModel.findOne({ phoneNumber }).exec();
            if (existingUser) {
                throw new common_1.BadRequestException('هذا الرقم مستعمل من قبل، جرب رقم آخر.');
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpiry = new Date();
            otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);
            const newUser = new this.userModel({
                phoneNumber,
                password: "dommyPassowrd",
                isVerified: false,
                otp,
                otpExpiry,
            });
            const savedUser = await newUser.save();
            try {
                await this.twilioService.sendOtpSms(phoneNumber, otp);
            }
            catch (error) {
                await this.userModel.deleteOne({ _id: savedUser._id });
                throw new common_1.BadRequestException('فشل في إرسال كود OTP');
            }
            return { message: 'OTP sent successfully', userId: savedUser._id };
        }
        catch (error) {
            console.error(error);
            throw new common_1.BadRequestException('خطأ في تسجيل الدخول');
        }
    }
    async register(createUserDto) {
        try {
            const { name, phoneNumber, role, password } = createUserDto;
            const existingUser = await this.userModel.findOne({ phoneNumber }).exec();
            if (existingUser) {
                throw new common_1.BadRequestException('هاد الرقم مستعمل من قبل جرب رقم أخر');
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpiry = new Date();
            otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const newUser = new this.userModel({
                name,
                phoneNumber,
                role,
                password: hashedPassword,
                isVerified: false,
                otp,
                otpExpiry
            });
            const savedUser = await newUser.save();
        }
        catch (error) {
            console.error('Registration error:', error);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Registration failed');
        }
    }
    async verifyOTP(phoneNumber, otp) {
        const user = await this.userModel.findOne({ phoneNumber }).exec();
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (user.otp !== otp) {
            throw new common_1.BadRequestException('الرمز غلط');
        }
        if (new Date() > user.otpExpiry) {
            throw new common_1.BadRequestException('هاد رمز نتهات صلحية تاعو');
        }
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();
        return { message: 'تم أتحقق بنجاح' };
    }
    async login(LoginUserDto) {
        const { phoneNumber, password } = LoginUserDto;
        const User = await this.userModel.findOne({ phoneNumber }).exec();
        if (!User) {
            throw new common_1.BadRequestException("This User Does not exists");
        }
        if (!User.isVerified) {
            throw new common_1.BadRequestException('Phone number not verified');
        }
        const isPasswordValid = await bcrypt.compare(password, User.password);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Password incorrect');
        }
        const secretKey = process.env.JWT_SECRET;
        try {
            const token = jwt.sign({
                id: User._id,
                phoneNumber: User.phoneNumber,
                role: User.role,
            }, secretKey, { expiresIn: '1h' });
            return {
                message: 'Login successful',
                User,
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
            throw new common_1.BadRequestException("حاول مرة أخرى");
        }
    }
    update(id, updateDto) {
        return `This action updates a #${id} user`;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        twilio_service_1.TwilioService])
], UserService);
//# sourceMappingURL=user.service.js.map