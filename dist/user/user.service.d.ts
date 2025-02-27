import { Model } from 'mongoose';
import { UserDocument } from './entities/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/Logindto/login-user.dto';
import { TwilioService } from 'src/services/twilio.service';
import { SignInToAppDto } from './dto/Logindto/signInToApp.dto';
export declare class UserService {
    private userModel;
    private twilioService;
    constructor(userModel: Model<UserDocument>, twilioService: TwilioService);
    signInToApp(signInToAppDto: SignInToAppDto): Promise<{
        message: string;
        userId: unknown;
    }>;
    register(createUserDto: CreateUserDto): Promise<void>;
    verifyOTP(phoneNumber: string, otp: string): Promise<{
        message: string;
    }>;
    login(LoginUserDto: LoginUserDto): Promise<any>;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateUserDto: any): string;
    remove(id: number): string;
}
