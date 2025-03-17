import { IsNotEmpty, IsString, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignInToAppDto {

    @ApiProperty({ example: '+212697042868', required: true })

    @IsString()
    @IsNotEmpty()
    @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be in international format (e.g., +212697042868)'
    })

    @ApiProperty({ example: '123456', required: true })
    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

}
