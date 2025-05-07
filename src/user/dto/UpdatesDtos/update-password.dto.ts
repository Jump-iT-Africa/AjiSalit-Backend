import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";

export class UpdatePassword{

    @ApiProperty({ example: '123456', required: true })
    @IsString({message:"The password should sent as format string like '287398' "})
    @Matches(/^\d{6}$/, {message: "The your last password must contain 6 numbers only"})
    @IsNotEmpty({message:"Your old password should not be empty"})
    oldPassword: string

    @ApiProperty({example: "123456",required: true})
    @IsString({message:"The new password should sent as format string like '287398' "})
    @Matches(/^\d{6}$/, {message: "The your new password must contain 6 numbers only"})
    @IsNotEmpty({message:"Your new password should not be empty"})
    password:string
}