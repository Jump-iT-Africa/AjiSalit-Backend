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
const response_info_company_dto_1 = require("./dto/ResponseDto/response-info-company.dto");
const secretKey = process.env.JWT_SECRET;
let UserService = class UserService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async register(createUserDto) {
        try {
            const { Lname, Fname, companyName, phoneNumber, role, password, city, field, ice, ownRef, refBy, listRefs } = createUserDto;
            const existingUser = await this.userModel.findOne({ phoneNumber }).exec();
            if (existingUser) {
                return {
                    message: "This number is already used, try to login or use another one"
                };
            }
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            console.log("test", hashedPassword, password);
            const GeneratedRefCode = this.generateReferralCode();
            const newUser = new this.userModel({
                Fname,
                Lname,
                companyName,
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
                Fname: savedUser.Fname,
                Lname: savedUser.Lname,
                companyName: savedUser.companyName,
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
                Fname: User.Fname,
                Lname: User.Lname,
                city: User.city,
                field: User.field,
                ice: User.ice,
                role: User.role,
            }, secretKey, { expiresIn: '30d' });
            let user = (0, class_transformer_1.plainToClass)(response_login_dto_1.ResponseLoginDto, User, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true
            });
            return {
                message: 'Login successful',
                user,
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
                throw new common_1.NotFoundException("Command not found");
            }
            if (authentificatedId !== result._id.toString()) {
                throw new common_1.ForbiddenException("You aren't authorized to perform this task");
            }
            const updateAuthentificator = await this.userModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
            return "The account created successfully";
        }
        catch (e) {
            console.log(e);
            throw new common_1.BadRequestException("try again");
        }
    }
    findAll() {
        return `This action returns all users`;
    }
    async findOne(userid) {
        try {
            let result = await this.userModel.findById({ _id: userid }).exec();
            if (!result) {
                throw new common_1.NotFoundException("The account not found");
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
                throw new common_1.NotFoundException("The account not found");
            }
            throw new common_1.BadRequestException("try again");
        }
    }
    async updateSocketId(userId, socketUserId) {
        try {
            let result = await this.userModel.findById(userId).exec();
            if (!result) {
                throw new common_1.NotFoundException("user not found");
            }
            if (userId !== result._id.toString()) {
                throw new common_1.ForbiddenException("You aren't authorized to perform this task");
            }
            let updateDto = {
                socketId: socketUserId
            };
            const updateAuthentificator = await this.userModel.findByIdAndUpdate(userId, updateDto, { new: true }).exec();
            return "updated successfully";
        }
        catch (e) {
            console.log('ops');
        }
    }
    async deleteAccount(id, userId) {
        try {
            let account = await this.userModel.findById(id);
            if (!account) {
                throw new common_1.NotFoundException("The account not found");
            }
            if (account._id.toString() !== userId) {
                throw new common_1.ForbiddenException("You aren't authorized to perform this task تمسح هاد الحساب");
            }
            let deleteAccount = await this.userModel.findByIdAndDelete(id).exec();
            return "The account was deleted successfully";
        }
        catch (e) {
            if (e instanceof jwt.JsonWebTokenError || e instanceof jwt.TokenExpiredError)
                throw new common_1.UnauthorizedException("Try to login again");
            if (e instanceof common_1.ForbiddenException) {
                throw new common_1.ForbiddenException("You are not allowed to update this oder");
            }
            throw new common_1.BadRequestException("Try again");
        }
    }
    async updateUserInfo(id, updateUserDto) {
        try {
            const toUpdate = await this.userModel.findById(id);
            if (!toUpdate) {
                throw new common_1.NotFoundException("the user not found ");
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
            throw new common_1.BadRequestException("Ops something went wrong ");
        }
    }
    async VerifyNumber(phoneNumber, verifyNumberDto) {
        try {
            const dtoInstance = (0, class_transformer_1.plainToInstance)(VerifyPhoneNumber_dto_1.VerifyNumberDto, verifyNumberDto);
            const errors = await (0, class_validator_1.validate)(dtoInstance);
            const isExist = false;
            if (errors.length > 0) {
                const validationErrors = errors.map(err => Object.values(err.constraints)).join(', ');
                throw new common_1.BadRequestException(`Validation failed: ${validationErrors}`);
            }
            const user = await this.userModel.findOne({ phoneNumber }).exec();
            console.log(user);
            if (user) {
                return {
                    statusCode: 409,
                    isExist,
                    UserName: user.Fname,
                    role: user.role,
                    message: 'Phone number already exists',
                };
            }
            else {
                return {
                    statusCode: 200,
                    isExist: true,
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
    async UpdateFirstName(userId, updateFirstName) {
        try {
            let user = await this.userModel.findById(userId);
            if (!user) {
                throw new common_1.NotFoundException("The user not found, Try again");
            }
            let updateUser = await this.userModel.findByIdAndUpdate(userId, updateFirstName, { new: true });
            if (!updateUser) {
                throw new common_1.BadRequestException("Ops, the user's first name didn't update");
            }
            let updatedUser = (0, class_transformer_1.plainToClass)(response_login_dto_1.ResponseLoginDto, updateUser, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true
            });
            return updatedUser;
        }
        catch (e) {
            console.log("the error is here", e);
            if (e instanceof common_1.NotFoundException || e instanceof common_1.BadRequestException) {
                throw e;
            }
        }
    }
    async UpdateLastName(userId, updateLastNameDto) {
        try {
            let user = await this.userModel.findById(userId);
            if (!user) {
                throw new common_1.NotFoundException("The user not found, Try again");
            }
            let updateUser = await this.userModel.findByIdAndUpdate(userId, updateLastNameDto, { new: true });
            if (!updateUser) {
                throw new common_1.BadRequestException("Ops, the user's last name didn't update");
            }
            let updatedUser = (0, class_transformer_1.plainToClass)(response_login_dto_1.ResponseLoginDto, updateUser, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true
            });
            return updatedUser;
        }
        catch (e) {
            console.log("the error is here", e);
            if (e instanceof common_1.NotFoundException || e instanceof common_1.BadRequestException) {
                throw e;
            }
        }
    }
    async UpdateCityName(userId, updateCityNameDto) {
        try {
            let user = await this.userModel.findById(userId);
            if (!user) {
                throw new common_1.NotFoundException("The user not found, Try again");
            }
            let updateUser = await this.userModel.findByIdAndUpdate(userId, updateCityNameDto, { new: true });
            if (!updateUser) {
                throw new common_1.BadRequestException("Ops, the user's city didn't update");
            }
            let updatedUser = (0, class_transformer_1.plainToClass)(response_login_dto_1.ResponseLoginDto, updateUser, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true
            });
            return updatedUser;
        }
        catch (e) {
            console.log("the error is here", e);
            if (e instanceof common_1.NotFoundException || e instanceof common_1.BadRequestException) {
                throw e;
            }
        }
    }
    async UpdateCompanyName(userId, updateCompanyNameDto) {
        try {
            let user = await this.userModel.findById(userId);
            if (!user) {
                throw new common_1.NotFoundException("The user not found, Try again");
            }
            let updateUser = await this.userModel.findByIdAndUpdate(userId, updateCompanyNameDto, { new: true });
            if (!updateUser) {
                throw new common_1.BadRequestException("Ops, the user didn't update");
            }
            let updatedUser = (0, class_transformer_1.plainToClass)(response_login_dto_1.ResponseLoginDto, updateUser, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true
            });
            return updatedUser;
        }
        catch (e) {
            console.log("the error is here", e);
            if (e instanceof common_1.NotFoundException || e instanceof common_1.BadRequestException) {
                throw e;
            }
        }
    }
    async UpdateField(userId, updateFieldDto) {
        try {
            let user = await this.userModel.findById(userId);
            if (!user) {
                throw new common_1.NotFoundException("The user not found, Try again");
            }
            let updateUser = await this.userModel.findByIdAndUpdate(userId, updateFieldDto, { new: true });
            if (!updateUser) {
                throw new common_1.BadRequestException("Ops, the user didn't update");
            }
            let updatedUser = (0, class_transformer_1.plainToClass)(response_login_dto_1.ResponseLoginDto, updateUser, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true
            });
            return updatedUser;
        }
        catch (e) {
            console.log("the error is here", e);
            if (e instanceof common_1.NotFoundException || e instanceof common_1.BadRequestException) {
                throw e;
            }
        }
    }
    async getAllCompanies() {
        try {
            let result = await this.userModel.find({ role: "company" }).exec();
            if (!result) {
                throw new common_1.NotFoundException("Ops No result found");
            }
            if (result.length == 0) {
                return "No comapanies yet";
            }
            let dataCompanies = (0, class_transformer_1.plainToClass)(response_info_company_dto_1.ResoponseCompanyInfoDto, result, { excludeExtraneousValues: true, enableImplicitConversion: true });
            return dataCompanies;
        }
        catch (e) {
            console.log("there's an error", e);
            if (e instanceof common_1.NotFoundException) {
                throw e;
            }
            throw e;
        }
    }
    async getAllClients() {
        try {
            let result = await this.userModel.find({ role: "client" }).exec();
            if (!result) {
                throw new common_1.NotFoundException("Ops there's no data found");
            }
            if (result.length == 0) {
                return "No clients yet";
            }
            let dataCompanies = (0, class_transformer_1.plainToClass)(response_user_dto_1.ResponseUserDto, result, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true
            });
            return dataCompanies;
        }
        catch (e) {
            console.log("there's an error", e);
        }
    }
    async updatePocketBalance(companyId, updateBalance) {
        try {
            let updatePocketBalance = await this.userModel.findByIdAndUpdate({ _id: companyId }, updateBalance, { new: true, runValidators: true }).exec();
            if (updatePocketBalance == null) {
                throw new common_1.NotFoundException("Company not found");
            }
            let dataCompanies = (0, class_transformer_1.plainToClass)(response_info_company_dto_1.ResoponseCompanyInfoDto, updatePocketBalance, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true
            });
            return dataCompanies;
        }
        catch (e) {
            if (e instanceof common_1.NotFoundException) {
                throw e;
            }
            console.log("there's an error", e);
        }
    }
    async updatePassword(updatePasswordDto, userId) {
        try {
            let user = await this.userModel.findById(userId).exec();
            if (!user) {
                throw new common_1.NotFoundException("The  user not found");
            }
            console.log();
            let isCorrectPassword = await bcrypt.compare(updatePasswordDto.oldPassword, user.password);
            if (!isCorrectPassword) {
                throw new common_1.UnauthorizedException("Ops, your password is incorrect");
            }
            const saltRounds = 10;
            let hashedNewPassword = await bcrypt.hash(updatePasswordDto.password, saltRounds);
            updatePasswordDto.password = hashedNewPassword;
            let updatePassword = await this.userModel.findByIdAndUpdate(userId, updatePasswordDto, { new: true, runValidators: true });
            if (updatePassword.password = hashedNewPassword) {
                return "The password has been updated successfully";
            }
        }
        catch (e) {
            if (e instanceof common_1.NotFoundException || e instanceof common_1.UnauthorizedException || e instanceof common_1.BadRequestException) {
                throw e;
            }
            console.log("error", e);
            throw new common_1.BadRequestException("Ops, coudln't update the password");
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserService);
//# sourceMappingURL=user.service.js.map