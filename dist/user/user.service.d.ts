import { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from './entities/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/Logindto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResoponseCompanyDto } from "./dto/ResponseDto/response-company.dto";
import { ResponseUserDto } from './dto/ResponseDto/response-user.dto';
import { ResponseLoginDto } from './dto/ResponseDto/response-login.dto';
import { VerifyNumberDto } from "./dto/Logindto/VerifyPhoneNumber.dto";
export declare class UserService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    register(createUserDto: CreateUserDto): Promise<{
        message: string;
        user?: undefined;
        token?: undefined;
        ErrorMessage?: undefined;
    } | {
        user: {
            id: unknown;
            Fname: string;
            Lname: string;
            companyName: string;
            phoneNumber: string;
            role: string;
            city: string;
            field: string;
            ice: number;
            ownRef: string;
            listRefs: string[];
        };
        token: string;
        message?: undefined;
        ErrorMessage?: undefined;
    } | {
        ErrorMessage: any;
        message?: undefined;
        user?: undefined;
        token?: undefined;
    }>;
    generateReferralCode(): string;
    login(LoginUserDto: LoginUserDto): Promise<any>;
    updateAuthentifictaion(id: string, updateDto: any, authentificatedId: any): Promise<string>;
    findAll(): string;
    findOne(userid: string | ObjectId): Promise<ResoponseCompanyDto | ResponseUserDto>;
    updateSocketId(userId: string, socketUserId: string): Promise<string>;
    deleteAccount(id: string, userId: any): Promise<string>;
    updateUserInfo(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    VerifyNumber(phoneNumber: string, verifyNumberDto: VerifyNumberDto): Promise<{
        statusCode: number;
        isExist: boolean;
        UserName: string;
        role: string;
        message: string;
    } | {
        statusCode: number;
        isExist: boolean;
        message: string;
        UserName?: undefined;
        role?: undefined;
    }>;
    UpdateFirstName(userId: string, updateFirstName: any): Promise<ResponseLoginDto>;
    UpdateLastName(userId: string, updateLastNameDto: any): Promise<ResponseLoginDto>;
    UpdateCityName(userId: any, updateCityNameDto: any): Promise<ResponseLoginDto>;
    UpdateCompanyName(userId: any, updateCompanyNameDto: any): Promise<ResponseLoginDto>;
    UpdateField(userId: any, updateFieldDto: any): Promise<ResponseLoginDto>;
}
