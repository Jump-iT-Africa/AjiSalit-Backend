import { IsNotEmpty, IsString, Matches, IsPhoneNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignInToAppDto {

    @ApiProperty({ example: '+212697042868', required: true })
    @IsPhoneNumber()
    @IsNotEmpty()

    phoneNumber: string;


    @ApiProperty({ example: '123456', required: true })
    @IsString()
    @IsNotEmpty()
    password:string



}
