import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, IsEnum, IsOptional } from "class-validator";

export class UpdateUserDto {
        @ApiProperty({
                example: 'Test test',
                required: true
        })
        @IsString()
        @IsNotEmpty({ message: "الاسم و اللقب ديالك ضروري" })
        name: string;

        @ApiProperty({
                example: '212600000000',
                required: false
        })
        @IsString()
        @IsOptional()
        @Matches(/^\+[1-9]\d{1,14}$/, {
                message: 'Phone number must be in international format (e.g., +212697042868)'
        })
        phoneNumber: string;

        @ApiProperty({
                example: '1234',
                required: false
        })
        @IsString()
        @IsOptional()
        password: string;
        @ApiProperty({
                example: 'company',
                required: true
        })
        @IsString()
        @IsNotEmpty()
        @IsEnum(['admin', 'client', 'company'])
        role: string;
}
