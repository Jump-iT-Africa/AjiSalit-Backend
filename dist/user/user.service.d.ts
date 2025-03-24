import { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from './entities/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/Logindto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResoponseCompanyDto } from "./dto/ResponseDto/response-company.dto";
import { ResponseUserDto } from './dto/ResponseDto/response-user.dto';
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
            name: string;
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
}
