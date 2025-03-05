import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/Logindto/login-user.dto';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();
import * as bcrypt from 'bcrypt';
// import { TwilioService } from 'src/services/twilio.service';
import { SignInToAppDto } from './dto/Logindto/signInToApp.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { instanceToPlain, plainToClass, plainToInstance} from 'class-transformer';
import {ResoponseCompanyDto} from "./dto/ResponseDto/response-company.dto"
import { ResponseUserDto } from './dto/ResponseDto/response-user.dto';



@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    // private twilioService: TwilioService,
  ) { }

  async signInToApp(signInToAppDto: SignInToAppDto) {
    try {
      const { phoneNumber } = signInToAppDto;

      const existingUser = await this.userModel.findOne({ phoneNumber }).exec();

      if (existingUser) {
        throw new BadRequestException('هذا الرقم مستعمل من قبل، جرب رقم آخر.');
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
      return savedUser

      // try {
      //   await this.twilioService.sendOtpSms(phoneNumber, otp);
      // } catch (error) {
      //   await this.userModel.deleteOne({ _id: savedUser._id });
      //   throw new BadRequestException('فشل في إرسال كود OTP');
      // }

      // return { message: 'OTP sent successfully', userId: savedUser._id };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('خطأ في تسجيل الدخول');
    }
  }


  async register(createUserDto: CreateUserDto) {
    try {
      const { name, phoneNumber, role, password } = createUserDto;

      const existingUser = await this.userModel.findOne({ phoneNumber }).exec();
      if (existingUser) {
        throw new BadRequestException('هاد الرقم مستعمل من قبل جرب رقم أخر');
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


    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Registration failed');
    }
  }

  async verifyOTP(phoneNumber: string, otp: string) {
    const user = await this.userModel.findOne({ phoneNumber }).exec();

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.otp !== otp) {
      throw new BadRequestException('الرمز غلط');
    }

    if (new Date() > user.otpExpiry) {
      throw new BadRequestException('هاد رمز نتهات صلحية تاعو');
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return { message: 'تم أتحقق بنجاح' };
  }

  async login(LoginUserDto: LoginUserDto): Promise<any> {
    const { phoneNumber, password } = LoginUserDto;
    const User = await this.userModel.findOne({ phoneNumber }).exec();

    if (!User) {
      throw new BadRequestException("This User Does not exists");
    }

    if (!User.isVerified) {
      throw new BadRequestException('Phone number not verified');
    }

    const isPasswordValid = await bcrypt.compare(password, User.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Password incorrect'); // Changed from Error to BadRequestException
    }

    const secretKey = process.env.JWT_SECRET;

    try {
      const token = jwt.sign(
        {
          id: User._id,
          phoneNumber: User.phoneNumber,
          role: User.role,
        },
        secretKey,
        { expiresIn: '1h' }
      );

      return {
        message: 'Login successful',
        User,
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
      throw new BadRequestException("حاول مرة أخرى")

    }
  }

  update(id: string, updateDto: UpdateUserDto | UpdateCompanyDto) {
    return `This action updates a #${id} user`;
  }

  // remove(id: string) {
  //   try{

  //   }catch(e){
  //     throw new BadRequestException("حاول مرة أخرى")
  //   }
  // }
}
