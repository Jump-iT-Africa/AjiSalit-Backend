import { IsNotEmpty, IsString, Matches, IsPhoneNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignInToAppDto {

    @ApiProperty({ example: '+212697042868', required: true })
    @IsPhoneNumber()
    @Matches(/^\+[1-9]\d{1,14}$/, {
        message: 'Phone number must be in international format (e.g., +212697042868)'
    })
    @IsNotEmpty()

    phoneNumber: string;


    @ApiProperty({ example: '123456', required: true })
    @IsString()
    @IsNotEmpty()
    password:string



}
