import { Model, ObjectId } from "mongoose";
import { User, UserDocument } from "./entities/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/Logindto/login-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ResoponseCompanyDto } from "./dto/ResponseDto/response-company.dto";
import { ResponseUserDto } from "./dto/ResponseDto/response-user.dto";
import { ResponseLoginDto } from "./dto/ResponseDto/response-login.dto";
import { VerifyNumberDto } from "./dto/Logindto/VerifyPhoneNumber.dto";
import { ResoponseCompanyInfoDto } from "./dto/ResponseDto/response-info-company.dto";
import { ResponseCompanyInfoForAdminDto } from "./dto/ResponseDto/response-all-companies.dto";
import { CommandService } from "../command/command.service";
import { ResoponseAdminDto } from "./dto/ResponseDto/response-admin.dto";
export declare class UserService {
    private userModel;
    private readonly commandService;
    constructor(userModel: Model<UserDocument>, commandService: CommandService);
    register(createUserDto: CreateUserDto): Promise<{
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
    }>;
    generateReferralCode(): string;
    login(LoginUserDto: LoginUserDto): Promise<any>;
    updateAuthentifictaion(id: string, updateDto: any, authentificatedId: any): Promise<string>;
    findAll(): string;
    findOne(userid: string | ObjectId): Promise<ResoponseCompanyDto | ResponseUserDto | ResoponseAdminDto>;
    updateSocketId(userId: string, socketUserId: string): Promise<string>;
    deleteAccount(id: string, userId: any): Promise<string>;
    updateUserInfo(id: string, updateUserDto: UpdateUserDto, imageFile: Express.Multer.File): Promise<User>;
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
    getAllCompanies(): Promise<"No comapanies yet" | ResponseCompanyInfoForAdminDto[]>;
    getAllClients(): Promise<"No clients yet" | ResponseUserDto[]>;
    updatePocketBalance(companyId: any, updateBalance: any): Promise<ResoponseCompanyInfoDto>;
    updatePassword(updatePasswordDto: any, userId: string): Promise<string>;
    getStatistics(): Promise<{
        "Total Users": number;
        "Total clients": number;
        "Total companies": number;
        "Total admins": number;
    }>;
}
