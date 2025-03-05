import { Model } from 'mongoose';
import { UserDocument } from './entities/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/Logindto/login-user.dto';
import { TwilioService } from 'src/services/twilio.service';
import { SignInToAppDto } from './dto/Logindto/signInToApp.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResoponseCompanyDto } from "./dto/ResponseDto/response-company.dto";
import { ResponseUserDto } from './dto/ResponseDto/response-user.dto';
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
    updateAuthentifictaion(id: string, updateDto: any, authentificatedId: any): Promise<string>;
    findAll(): string;
    findOne(id: string): Promise<ResoponseCompanyDto | ResponseUserDto>;
    update(id: string, updateDto: UpdateUserDto | UpdateCompanyDto): string;
}
