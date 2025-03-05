import { IsNotEmpty, IsString, Matches, IsEnum, IsOptional } from "class-validator";

export class UpdateUserDto {
        @IsString()
        @IsNotEmpty({message:"الاسم و اللقب ديالك ضروري"})
        name: string;
    
        @IsString()
        @IsOptional()
        @Matches(/^\+[1-9]\d{1,14}$/, {
        message: 'Phone number must be in international format (e.g., +212697042868)'
        })
        phoneNumber: string;
    
        @IsString()
        @IsOptional()
        password: string;
    
        @IsString()
        @IsNotEmpty()
        @IsEnum(['admin', 'client', 'company']) 
        role: string;
}
