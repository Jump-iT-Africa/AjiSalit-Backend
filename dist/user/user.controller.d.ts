import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/Logindto/login-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    register(CreateUserDto: CreateUserDto): Promise<{
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
    login(LoginUserDto: LoginUserDto): Promise<any>;
    findOne(id: string, req: any): Promise<import("./dto/ResponseDto/response-company.dto").ResoponseCompanyDto | import("./dto/ResponseDto/response-user.dto").ResponseUserDto>;
    deleteAccount(id: string, req: any): Promise<string>;
    updateUserProfile(id: string, updateUserDto: UpdateUserDto, req: any): Promise<import("./entities/user.schema").User>;
}
