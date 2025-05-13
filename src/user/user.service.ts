import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, ObjectId } from "mongoose";
import { User, UserDocument } from "./entities/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/Logindto/login-user.dto";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
import * as bcrypt from "bcrypt";
// import { TwilioService } from '../services/twilio.service';
// import { SignInToAppDto } from './dto/Logindto/signInToApp.dto';
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { plainToClass, plainToInstance } from "class-transformer";
import { ResoponseCompanyDto } from "./dto/ResponseDto/response-company.dto";
import { ResponseUserDto } from "./dto/ResponseDto/response-user.dto";
import { ResponseLoginDto } from "./dto/ResponseDto/response-login.dto";
import * as crypto from "crypto";
import { log } from "console";
import { isInstance, validate } from "class-validator";
import { VerifyNumberDto } from "./dto/Logindto/VerifyPhoneNumber.dto";
import { ResoponseCompanyInfoDto } from "./dto/ResponseDto/response-info-company.dto";
import { hasSubscribers } from "diagnostics_channel";

const secretKey = process.env.JWT_SECRET;

@Injectable()
export class UserService {
  constructor(@InjectModel("User") private userModel: Model<UserDocument>) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const {
        Lname,
        Fname,
        companyName,
        phoneNumber,
        role,
        password,
        city,
        field,
        ice,
        ownRef,
        refBy,
        listRefs,
        pocket,
      } = createUserDto;

      createUserDto.phoneNumber = createUserDto.phoneNumber
        .trim()
        .replace(/\s/g, "");
      if (createUserDto.phoneNumber[4] == "0") {
        createUserDto.phoneNumber = createUserDto.phoneNumber.replace(
          createUserDto.phoneNumber[4],
          ""
        );
      }
      const existingUser = await this.userModel
        .findOne({ phoneNumber: createUserDto.phoneNumber })
        .exec();
      if (existingUser) {
        throw new ConflictException(
          "This number is already used, try to login or use another one"
        );
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      console.log("test", hashedPassword, password);
      const GeneratedRefCode = this.generateReferralCode();

      if (createUserDto.role == "company") {
        createUserDto.pocket = 250;
      }
      console.log(
        "the role after change the pocket balance",
        createUserDto.role,
        createUserDto.pocket
      );

      const newUser = new this.userModel({
        Fname,
        Lname,
        companyName,
        phoneNumber: createUserDto.phoneNumber,
        role,
        password: hashedPassword,
        city,
        field,
        pocket: createUserDto.pocket,
        ice,
        ownRef: GeneratedRefCode,
        refBy,
        listRefs: listRefs || [],
      });

      const savedUser = await newUser.save();

      if (refBy) {
        const referrer = await this.userModel.findOne({ ownRef: refBy }).exec();

        if (referrer) {
          await this.userModel.findByIdAndUpdate(
            referrer._id,
            { $push: { listRefs: savedUser._id.toString() } },
            { new: true }
          );
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
        listRefs: savedUser.listRefs,
      };

      const token = jwt.sign(payload, secretKey, { expiresIn: "30d" });

      return {
        user: payload,
        token,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error("Registration error:", error);
      return {
        ErrorMessage: error,
      };
    }
  }

  generateReferralCode(): string {
    return crypto.randomBytes(4).toString("hex").toUpperCase();
  }

  // async verifyOTP(phoneNumber: string, otp: string) {
  //   const user = await this.userModel.findOne({ phoneNumber }).exec();

  //   if (!user) {
  //     throw new BadRequestException('User not found');
  //   }

  //   if (user.otp !== otp) {
  //     throw new BadRequestException('الرمز غلط');
  //   }

  //   if (new Date() > user.otpExpiry) {
  //     throw new BadRequestException('هاد رمز نتهات صلحية تاعو');
  //   }

  //   user.isVerified = true;
  //   user.otp = undefined;
  //   user.otpExpiry = undefined;
  //   await user.save();

  //   return { message: 'تم أتحقق بنجاح' };
  // }

  async login(LoginUserDto: LoginUserDto): Promise<any> {
    const { phoneNumber, password } = LoginUserDto;
    LoginUserDto.phoneNumber = phoneNumber.trim().replace(/\s/g, "");
    if (LoginUserDto.phoneNumber[4] == "0") {
      LoginUserDto.phoneNumber = LoginUserDto.phoneNumber.replace(
        LoginUserDto.phoneNumber[4],
        ""
      );
    }

    const User = await this.userModel
      .findOne({ phoneNumber: LoginUserDto.phoneNumber })
      .exec();

    if (!User) {
      throw new BadRequestException("This User Does not exists");
    }

    const isPasswordValid = await bcrypt.compare(password, User.password);

    if (!isPasswordValid) {
      throw new BadRequestException("Password incorrect"); // Changed from Error to BadRequestException
    }

    try {
      //hna i stored all the needed info in the jwt so i dont need to send a request to get the data of the auth user
      const token = jwt.sign(
        {
          id: User._id,
          phoneNumber: User.phoneNumber,
          Fname: User.Fname,
          Lname: User.Lname,
          city: User.city,
          field: User.field,
          ice: User.ice,
          role: User.role,
        },
        secretKey,
        { expiresIn: "30d" }
      );
      let user = plainToClass(ResponseLoginDto, User, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      return {
        message: "Login successful",
        user,
        token,
      };
    } catch (error) {
      throw new BadRequestException("There was an error while login");
    }
  }

  async updateAuthentifictaion(id: string, updateDto, authentificatedId) {
    try {
      console.log("hello from service ,", updateDto);
      let result = await this.userModel.findById(id).exec();
      if (!result) {
        throw new NotFoundException("Command not found");
      }
      // console.log(authentificatedId, "user ",result._id)
      if (authentificatedId !== result._id.toString()) {
        throw new ForbiddenException(
          "You aren't authorized to perform this task"
        );
      }
      const updateAuthentificator = await this.userModel
        .findByIdAndUpdate(id, updateDto, { new: true })
        .exec();
      return "The account created successfully";
    } catch (e) {
      console.log(e);
      throw new BadRequestException("try again");
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(userid: string | ObjectId) {
    try {
      let result = await this.userModel.findById({ _id: userid }).exec();
      console.log("there;s an error ");
      if (!result) {
        throw new NotFoundException("The account not found");
      }
      if (result.role == "company") {
        let data = plainToClass(ResoponseCompanyDto, result, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
        return data;
      } else if (result.role == "client") {
        let data = plainToClass(ResponseUserDto, result, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
        return data;
      }
    } catch (e) {
      console.log("there's an error", e);
      if (e instanceof NotFoundException) {
        throw new NotFoundException("The account not found");
      }
      throw new BadRequestException("try again");
    }
  }

  async updateSocketId(userId: string, socketUserId: string) {
    try {
      let result = await this.userModel.findById(userId).exec();
      if (!result) {
        throw new NotFoundException("user not found");
      }
      // console.log(authentificatedId, "user ",result._id)
      if (userId !== result._id.toString()) {
        throw new ForbiddenException(
          "You aren't authorized to perform this task"
        );
      }
      let updateDto = {
        socketId: socketUserId,
      };
      const updateAuthentificator = await this.userModel
        .findByIdAndUpdate(userId, updateDto, { new: true })
        .exec();
      return "updated successfully";
    } catch (e) {
      console.log("ops");
    }
  }

  async deleteAccount(id: string, userId) {
    try {
      let account = await this.userModel.findById(id);
      if (!account) {
        throw new NotFoundException("The account not found");
      }
      if (account._id.toString() !== userId) {
        throw new ForbiddenException(
          "You aren't authorized to perform this task تمسح هاد الحساب"
        );
      }
      let deleteAccount = await this.userModel.findByIdAndDelete(id).exec();
      return "The account was deleted successfully";
    } catch (e) {
      if (
        e instanceof jwt.JsonWebTokenError ||
        e instanceof jwt.TokenExpiredError
      )
        throw new UnauthorizedException("Try to login again");
      if (e instanceof ForbiddenException) {
        throw new ForbiddenException("You are not allowed to update this oder");
      }
      throw new BadRequestException("Try again");
    }
  }

  async updateUserInfo(
    id: string,
    updateUserDto: UpdateUserDto
  ): Promise<User> {
    try {
      // console.log("teeeeeeeeest")
      const toUpdate = await this.userModel.findById(id);

      if (!toUpdate) {
        throw new NotFoundException("the user not found ");
      }

      const originalRefBy = toUpdate.refBy;

      // hadi galik a sidi bhal chi pipe you remove what you want to innclude chof had code
      //https://github.com/lujakob/nestjs-realworld-example-app/blob/master/src/user/user.service.ts
      delete updateUserDto.password;
      delete updateUserDto.ownRef;

      const newRefBy = updateUserDto.refBy;

      if (newRefBy && newRefBy !== originalRefBy) {
        const newReferrer = await this.userModel
          .findOne({ ownRef: newRefBy })
          .exec();

        if (newReferrer) {
          await this.userModel.findByIdAndUpdate(
            newReferrer._id,
            { $addToSet: { listRefs: id } },
            { new: true }
          );
        }

        if (originalRefBy) {
          const originalReferrer = await this.userModel
            .findOne({ ownRef: originalRefBy })
            .exec();
          if (originalReferrer) {
            await this.userModel.findByIdAndUpdate(
              originalReferrer._id,
              { $pull: { listRefs: id } },
              { new: true }
            );
          }
        }
      }

      Object.assign(toUpdate, updateUserDto);
      await toUpdate.save();

      return toUpdate;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw new BadRequestException("Ops something went wrong ");
    }
  }

  async VerifyNumber(phoneNumber: string, verifyNumberDto: VerifyNumberDto) {
    try {
      const dtoInstance = plainToInstance(VerifyNumberDto, verifyNumberDto);
      const errors = await validate(dtoInstance);
      const isExist = false;

      if (errors.length > 0) {
        const validationErrors = errors
          .map((err) => Object.values(err.constraints))
          .join(", ");
        throw new BadRequestException(`Validation failed: ${validationErrors}`);
      }

      const user = await this.userModel.findOne({ phoneNumber }).exec();
      console.log(user);

      if (user) {
        return {
          statusCode: 409,
          isExist,
          UserName: user.Fname,
          role: user.role,
          message: "Phone number already exists",
        };
      } else {
        return {
          statusCode: 200,
          isExist: true,
          message: "Phone number is valid",
        };
      }
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        statusCode: 400,
        message: "There was an unexpected error",
        error: error.message || error,
      });
    }
  }

  async UpdateFirstName(userId: string, updateFirstName) {
    try {
      let user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException("The user not found, Try again");
      }
      let updateUser = await this.userModel.findByIdAndUpdate(
        userId,
        updateFirstName,
        { new: true }
      );
      if (!updateUser) {
        throw new BadRequestException(
          "Ops, the user's first name didn't update"
        );
      }
      let updatedUser = plainToClass(ResponseLoginDto, updateUser, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
      return updatedUser;
    } catch (e) {
      console.log("the error is here", e);
      if (e instanceof NotFoundException || e instanceof BadRequestException) {
        throw e;
      }
    }
  }

  async UpdateLastName(userId: string, updateLastNameDto) {
    try {
      let user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException("The user not found, Try again");
      }
      let updateUser = await this.userModel.findByIdAndUpdate(
        userId,
        updateLastNameDto,
        { new: true }
      );
      if (!updateUser) {
        throw new BadRequestException(
          "Ops, the user's last name didn't update"
        );
      }
      let updatedUser = plainToClass(ResponseLoginDto, updateUser, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
      return updatedUser;
    } catch (e) {
      console.log("the error is here", e);
      if (e instanceof NotFoundException || e instanceof BadRequestException) {
        throw e;
      }
    }
  }

  async UpdateCityName(userId, updateCityNameDto) {
    try {
      let user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException("The user not found, Try again");
      }
      let updateUser = await this.userModel.findByIdAndUpdate(
        userId,
        updateCityNameDto,
        { new: true }
      );
      if (!updateUser) {
        throw new BadRequestException("Ops, the user's city didn't update");
      }
      let updatedUser = plainToClass(ResponseLoginDto, updateUser, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
      return updatedUser;
    } catch (e) {
      console.log("the error is here", e);
      if (e instanceof NotFoundException || e instanceof BadRequestException) {
        throw e;
      }
    }
  }

  async UpdateCompanyName(userId, updateCompanyNameDto) {
    try {
      let user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException("The user not found, Try again");
      }
      let updateUser = await this.userModel.findByIdAndUpdate(
        userId,
        updateCompanyNameDto,
        { new: true }
      );
      if (!updateUser) {
        throw new BadRequestException("Ops, the user didn't update");
      }
      let updatedUser = plainToClass(ResponseLoginDto, updateUser, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
      return updatedUser;
    } catch (e) {
      console.log("the error is here", e);
      if (e instanceof NotFoundException || e instanceof BadRequestException) {
        throw e;
      }
    }
  }

  async UpdateField(userId, updateFieldDto) {
    try {
      let user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException("The user not found, Try again");
      }
      let updateUser = await this.userModel.findByIdAndUpdate(
        userId,
        updateFieldDto,
        { new: true }
      );
      if (!updateUser) {
        throw new BadRequestException("Ops, the user didn't update");
      }
      let updatedUser = plainToClass(ResponseLoginDto, updateUser, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
      return updatedUser;
    } catch (e) {
      console.log("the error is here", e);
      if (e instanceof NotFoundException || e instanceof BadRequestException) {
        throw e;
      }
    }
  }

  async getAllCompanies() {
    try {
      let result = await this.userModel.find({ role: "company" }).exec();
      const resultComp = await this.userModel.aggregate([
        { $match: { role: "company" } },
        {
          $lookup: {
            from: "commands",
            localField: "_id",
            foreignField: "companyId",
            as: "commands",
          },
        },
      ]);
      console.log("here's the error", resultComp)

      if (!result) {
        throw new NotFoundException("Ops No result found");
      }
      if (result.length == 0) {
        return "No comapanies yet";
      }
      let dataCompanies = plainToClass(ResoponseCompanyInfoDto, result, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
      return dataCompanies;
    } catch (e) {
      console.log("there's an error", e);

      if (e instanceof NotFoundException) {
        throw e;
      }
      throw e;
    }
  }

  async getAllClients() {
    try {
      let result = await this.userModel.find({ role: "client" }).exec();
      if (!result) {
        throw new NotFoundException("Ops there's no data found");
      }
      if (result.length == 0) {
        return "No clients yet";
      }

      let dataCompanies = plainToClass(ResponseUserDto, result, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
      return dataCompanies;
    } catch (e) {
      console.log("there's an error", e);
    }
  }

  async updatePocketBalance(companyId, updateBalance) {
    try {
      let updatePocketBalance = await this.userModel
        .findByIdAndUpdate({ _id: companyId }, updateBalance, {
          new: true,
          runValidators: true,
        })
        .exec();
      // console.log("oh lali oh lala ", updatePocketBalance)
      if (updatePocketBalance == null) {
        throw new NotFoundException("Company not found");
      }
      let dataCompanies = plainToClass(
        ResoponseCompanyInfoDto,
        updatePocketBalance,
        {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        }
      );
      return dataCompanies;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      console.log("there's an error", e);
    }
  }

  async updatePassword(updatePasswordDto, userId: string) {
    try {
      let user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new NotFoundException("The  user not found");
      }
      console.log();
      let isCorrectPassword = await bcrypt.compare(
        updatePasswordDto.oldPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new UnauthorizedException("Ops, your password is incorrect");
      }
      const saltRounds = 10;
      let hashedNewPassword = await bcrypt.hash(
        updatePasswordDto.password,
        saltRounds
      );
      updatePasswordDto.password = hashedNewPassword;
      // console.log("last pass", user.password, "new pass", hashedNewPassword, "user Id", userId)
      let updatePassword = await this.userModel.findByIdAndUpdate(
        userId,
        updatePasswordDto,
        { new: true, runValidators: true }
      );
      if ((updatePassword.password = hashedNewPassword)) {
        return "The password has been updated successfully";
      }
    } catch (e) {
      if (
        e instanceof NotFoundException ||
        e instanceof UnauthorizedException ||
        e instanceof BadRequestException
      ) {
        throw e;
      }
      console.log("error", e);
      throw new BadRequestException("Ops, coudln't update the password");
    }
  }

  async getStatistics() {
    try {
      let totalUser = await this.userModel.countDocuments();
      console.log("happy coding here's total", totalUser);
      let totalClient = await this.userModel
        .find({ role: "client" })
        .countDocuments();
      console.log("happu client", totalClient);
      let totalComapies = await this.userModel
        .find({ role: "company" })
        .countDocuments();
      console.log("total companies are", totalComapies);
      let totalAdmins = await this.userModel
        .find({ role: "admin" })
        .countDocuments();
      console.log("Happy admins", totalAdmins);
      return {
        "Total Users": totalUser,
        "Total clients": totalClient,
        "Total companies": totalComapies,
        "Total admins": totalAdmins,
      };
    } catch (e) {
      console.log("Ops there's an error", e);
      throw new BadRequestException("Ops something went wrong");
    }
  }
}
