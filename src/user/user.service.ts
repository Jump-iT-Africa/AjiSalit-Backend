import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { https } from 'follow-redirects';
import { LoginUserDto } from './dto/Logindto/login-user.dto';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();
import * as bcrypt from 'bcrypt';
import { TwilioService } from 'src/services/twilio.service';
import { SignInToAppDto } from './dto/Logindto/signInToApp.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private twilioService: TwilioService,
  ) {}

  async signInToApp(signInToAppDto:SignInToAppDto) {
    try {
      const {phoneNumber} = signInToAppDto;

      const existingUser = await this.userModel.findOne({ phoneNumber }).exec();

      if (existingUser) {
        throw new BadRequestException('هذا الرقم مستعمل من قبل، جرب رقم آخر.');
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date();
      otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

      const newUser = new this.userModel({
        phoneNumber,
        password:"dommyPassowrd",
        isVerified: false,
        otp,
        otpExpiry,
      });

      const savedUser = await newUser.save();

      try {
        await this.twilioService.sendOtpSms(phoneNumber, otp);
      } catch (error) {
        await this.userModel.deleteOne({ _id: savedUser._id });
        throw new BadRequestException('فشل في إرسال كود OTP');
      }

      return { message: 'OTP sent successfully', userId: savedUser._id };
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

      const otp =  Math.floor(100000 + Math.random() * 900000).toString();
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
    const User = await this.userModel.findOne({phoneNumber}).exec();
  
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
    } catch(error) {
      throw new BadRequestException("There was an error while login");
    }
  }



  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
