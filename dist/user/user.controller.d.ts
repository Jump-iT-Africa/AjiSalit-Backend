import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/Logindto/login-user.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    register(CreateUserDto: CreateUserDto): Promise<void>;
    verifyOTP(phoneNumber: string, otp: string): Promise<{
        message: string;
    }>;
    login(LoginUserDto: LoginUserDto): Promise<any>;
    updateAuthentifictaion(id: any, updateDto: UpdateUserDto | UpdateCompanyDto, req: any): Promise<string>;
    findOne(id: string, req: any): Promise<import("./dto/ResponseDto/response-company.dto").ResoponseCompanyDto | import("./dto/ResponseDto/response-user.dto").ResponseUserDto>;
    deleteAccount(id: string, req: any): Promise<string>;
}
