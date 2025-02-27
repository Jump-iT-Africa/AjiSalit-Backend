import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/Logindto/login-user.dto';
import { SignInToAppDto } from './dto/Logindto/signInToApp.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    signInToApp(signInToAppDto: SignInToAppDto): Promise<{
        message: string;
        userId: unknown;
    }>;
    register(CreateUserDto: CreateUserDto): Promise<void>;
    verifyOTP(phoneNumber: string, otp: string): Promise<{
        message: string;
    }>;
    login(LoginUserDto: LoginUserDto): Promise<any>;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateUserDto: UpdateUserDto): string;
    remove(id: string): string;
}
