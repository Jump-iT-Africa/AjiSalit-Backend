import { IsNotEmpty, IsString, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {

    @ApiProperty({ example: '+212697042868', required: true })
    @IsString()
    @IsNotEmpty()
// @Matches(/^\+[1-9]\d{1,14}$/, {
    // message: 'Phone number must be in international format (e.g., +212697042868)'
    // })
    phoneNumber: string;


    @ApiProperty({ example: '123456', required: true })
    @Matches(/^\d{6}$/, {message: "The password must contain 6 numbers only"})
    @IsString()
    @IsNotEmpty()
    password:string
}
