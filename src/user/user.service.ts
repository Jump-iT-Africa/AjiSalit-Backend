import { Injectable, BadRequestException, NotFoundException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/Logindto/login-user.dto';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();
import * as bcrypt from 'bcrypt';
// import { TwilioService } from '../services/twilio.service';
import { SignInToAppDto } from './dto/Logindto/signInToApp.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToClass} from 'class-transformer';
import {ResoponseCompanyDto} from "./dto/ResponseDto/response-company.dto"
import { ResponseUserDto } from './dto/ResponseDto/response-user.dto';
import {ResponseLoginDto} from './dto/ResponseDto/response-login.dto'
import * as crypto from 'crypto';
import { log } from 'console';

const secretKey = process.env.JWT_SECRET;


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    // private twilioService: TwilioService,
  ) { }




  async register(createUserDto: CreateUserDto) {
    try {
      const { name, phoneNumber, role, password, city, field, ice, ownRef, refBy, listRefs } = createUserDto;
  
      const existingUser = await this.userModel.findOne({ phoneNumber }).exec();
      if (existingUser) {
        return {
          message: 'هاد الرقم مستعمل من قبل جرب رقم أخر'
        }
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
          await this.userModel.findByIdAndUpdate(
            referrer._id,
            { $push: { listRefs: savedUser._id.toString() } },
            { new: true }
          );
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
  
      const token = jwt.sign(payload, secretKey, { expiresIn: '1d' });
  
      return {
        user: payload,
        token,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        ErrorMessage: error
      }
    }
  }




  generateReferralCode(): string {
    return  crypto.randomBytes(4).toString('hex').toUpperCase(); 
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
    const User = await this.userModel.findOne({ phoneNumber }).exec();

    if (!User) {
      throw new BadRequestException("This User Does not exists");
    }

    const isPasswordValid = await bcrypt.compare(password, User.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Password incorrect'); // Changed from Error to BadRequestException
    }

    try {
      //hna i stored all the needed info in the jwt so i dont need to send a request to get the data of the auth user
      const token = jwt.sign(
        {
          id: User._id,
          phoneNumber: User.phoneNumber,
          username: User.name,
          city:User.city,
          field:User.field,
          ice:User.ice,
          role: User.role,
        },
        secretKey,
        { expiresIn: '1d' }
      );
      let userinfo =  plainToClass(ResponseLoginDto,User, {
        excludeExtraneousValues:true,
        enableImplicitConversion:true
      }) 

      return {
        message: 'Login successful',
        userinfo,
        token,
      };
    } catch (error) {
      throw new BadRequestException("There was an error while login");
    }
  }

  async updateAuthentifictaion(id: string, updateDto, authentificatedId) {
    try{
      console.log("hello from service ,", updateDto)
      let result = await this.userModel.findById(id).exec()
      if (!result) {
        throw new NotFoundException("حاول دخل رقم ديالك مرة أخرى")
      }
      // console.log(authentificatedId, "user ",result._id)
      if(authentificatedId !== result._id.toString()){
          throw new ForbiddenException("ممسموحش لك")
      }
      const updateAuthentificator = await this.userModel.findByIdAndUpdate(id, updateDto, {new:true}).exec()
      return "تم إنشاء حسابك بنجاح"

    }catch(e){
      console.log(e)
      throw new BadRequestException("حاول مرة أخرى")
    }

  }



  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    try{
      let result = await this.userModel.findById(id).exec()
      if(!result){
        throw new NotFoundException("حساب مكاينش، حاول مرة أخرى")
      }
      // console.log(result)
      if(result.role == "company"){
        let data = plainToClass(ResoponseCompanyDto,result, {
          excludeExtraneousValues:true,
          enableImplicitConversion:true
        })
        return data
      }else if(result.role == "client"){
        let data =plainToClass(ResponseUserDto,result, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true
          
      });
        //  plainToInstance(ResponseUserDto,result)
        return data
      }
    }catch(e){
      console.log("there's an error", e)
      if(e instanceof NotFoundException){
        throw new NotFoundException("حساب مكاينش، حاول مرة أخرى")
      }
      throw new BadRequestException("حاول مرة أخرى")

    }
  }

  update(id: string, updateDto: UpdateUserDto | UpdateCompanyDto) {
    return `This action updates a #${id} user`;
  }

async deleteAccount(id: string, userId) {
    try{
        let account = await this.userModel.findById(id);
        if(!account){
          throw new NotFoundException("الحساب ديالك مكاينش")
        }
        if(account._id.toString() !== userId){
          throw new ForbiddenException("ممسموحش لك تمسح هاد الحساب")
        }
        let deleteAccount = await this.userModel.findByIdAndDelete(id).exec();
        return "تم مسح الحساب بنجاح"
    }catch(e){
      if (e instanceof jwt.JsonWebTokenError || e instanceof jwt.TokenExpiredError)
        throw new UnauthorizedException("حاول تسجل مرة أخرى")
      if(e instanceof ForbiddenException){
        throw new ForbiddenException("ممسموحش لك تبدل هاد طلب")
      }
      throw new BadRequestException("حاول مرة خرى")
    }
  }




  async updateUserInfo(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const toUpdate = await this.userModel.findById(id);
  
      if (!toUpdate) {
        throw new NotFoundException('المستخدم غير موجود');
      }
  
      const originalRefBy = toUpdate.refBy;
      
      // hadi galik a sidi bhal chi pipe you remove what you want to innclude chof had code 
      //https://github.com/lujakob/nestjs-realworld-example-app/blob/master/src/user/user.service.ts
      delete updateUserDto.password;
      delete updateUserDto.ownRef;
  
     
      const newRefBy = updateUserDto.refBy;
      
      if (newRefBy && newRefBy !== originalRefBy) {
       
        const newReferrer = await this.userModel.findOne({ ownRef: newRefBy }).exec();
        
        if (newReferrer) {
         
          await this.userModel.findByIdAndUpdate(
            newReferrer._id,
            { $addToSet: { listRefs: id } },
            { new: true }
          );
        }
        
       
        if (originalRefBy) {
          const originalReferrer = await this.userModel.findOne({ ownRef: originalRefBy }).exec();
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
      throw new BadRequestException('تعذر تحديث الملف الشخصي');
    }
  }




  
  
  
}

