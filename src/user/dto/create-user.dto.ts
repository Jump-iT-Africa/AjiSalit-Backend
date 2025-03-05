import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, IsEnum, IsOptional } from "class-validator";

export class CreateUserDto {


    @IsString()
    @IsOptional()
    name: string;
    @ApiProperty({
        example: '+212697042868',
        required: true
    })

    @IsString()
    @IsNotEmpty()
    @Matches(/^\+[1-9]\d{1,14}$/, {
        message: 'Phone number must be in international format (e.g., +212697042868)'
    })
    phoneNumber: string;

    @ApiProperty({
        example: '1234',
        required: true
    })

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsOptional()
    @IsEnum(['admin', 'client', 'company'])
    role: string;

}
