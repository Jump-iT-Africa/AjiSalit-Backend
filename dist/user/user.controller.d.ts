import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LoginUserDto } from "./dto/Logindto/login-user.dto";
import { VerifyNumberDto } from "./dto/Logindto/VerifyPhoneNumber.dto";
import { UpdateFirstNameDto } from "./dto/UpdatesDtos/update-user-first-name.dto";
import { UpdateLastNameDto } from "./dto/UpdatesDtos/update-user-last-name.dto";
import { UpdateCityDto } from "./dto/UpdatesDtos/update-user-city-name.dto";
import { UpdateCompanyNameDto } from "./dto/UpdatesDtos/update-user-company-name.dto";
import { UpdateFieldDto } from "./dto/UpdatesDtos/update-user-field.dto";
import { ResoponseCompanyDto } from "./dto/ResponseDto/response-company.dto";
import { UpdatePocketBalance } from "./dto/UpdatesDtos/update-pocket.dto";
import { ResoponseCompanyInfoDto } from "./dto/ResponseDto/response-info-company.dto";
import { UpdatePassword } from "./dto/UpdatesDtos/update-password.dto";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    register(CreateUserDto: CreateUserDto): Promise<{
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
        ErrorMessage?: undefined;
    } | {
        ErrorMessage: any;
        user?: undefined;
        token?: undefined;
    }>;
    login(LoginUserDto: LoginUserDto): Promise<any>;
    getAllCompanies(): Promise<string | import("./dto/ResponseDto/response-all-companies.dto").ResponseCompanyInfoForAdminDto[]>;
    getAllClients(): Promise<string | import("./dto/ResponseDto/response-user.dto").ResponseUserDto[]>;
    statistics(): Promise<{
        "Total Users": number;
        "Total clients": number;
        "Total companies": number;
        "Total admins": number;
    }>;
    updatePocketBalance(companyId: string, updateBalance: UpdatePocketBalance): Promise<ResoponseCompanyInfoDto>;
    findOne(req: any): Promise<ResoponseCompanyDto | import("./dto/ResponseDto/response-user.dto").ResponseUserDto>;
    deleteAccount(id: string, req: any): Promise<string>;
    updateUserProfile(id: string, updateUserDto: UpdateUserDto, req: any): Promise<import("./entities/user.schema").User>;
    verifyPhone(verifyNumberDto: VerifyNumberDto): Promise<{
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
    updateFirstName(updateFirstName: UpdateFirstNameDto, req: any): Promise<import("./dto/ResponseDto/response-login.dto").ResponseLoginDto>;
    updateLastName(updateLastNameDto: UpdateLastNameDto, req: any): Promise<import("./dto/ResponseDto/response-login.dto").ResponseLoginDto | "JWT must be provided, try to login again">;
    updateCityName(updateCityNameDto: UpdateCityDto, req: any): Promise<import("./dto/ResponseDto/response-login.dto").ResponseLoginDto | "JWT must be provided, try to login again">;
    updatecompanyName(updateCompanyNameDto: UpdateCompanyNameDto, req: any): Promise<import("./dto/ResponseDto/response-login.dto").ResponseLoginDto | "JWT must be provided, try to login again">;
    updateField(updateFieldDto: UpdateFieldDto, req: any): Promise<import("./dto/ResponseDto/response-login.dto").ResponseLoginDto | "JWT must be provided, try to login again">;
    updatePassword(updatePasswordDto: UpdatePassword, req: any): Promise<string>;
}
