import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, IsEnum, IsOptional,IsArray, IsNumber } from "class-validator";

export class UpdateUserDto {
    @ApiProperty({ example: 'Test test', required: false })
    @IsString()
    @IsOptional()  
    name?: string;

    @ApiProperty({ example: '+212600000000', required: false })
    @IsString()
    @IsOptional()
    @Matches(/^\+[1-9]\d{1,14}$/, {
        message: 'Phone number must be in international format (e.g., +212697042868)'
    })
    phoneNumber?: string;

    @ApiProperty({ example: '1234', required: false })
    @IsString()
    @IsOptional()
    password?: string;

    @ApiProperty({ example: 'company', required: false })
    @IsString()
    @IsOptional()  
    @IsEnum(['admin', 'client', 'company'])
    role?: string;

    @ApiProperty({ example: 'Casablanca', required: false })
    @IsString()
    @IsOptional()
    city?: string;

    @ApiProperty({ example: 'Technology', required: false })
    @IsString()
    @IsOptional()
    field?: string;

    @ApiProperty({ example: '12345678910123', required: false })
    @IsString()
    @IsOptional()
    @Matches(/^\d{14}$/, { message: 'ICE خاص اكن فيه 14 لرقم' })
    ice?: string;

    @ApiProperty({ example: 'AS30Dd2', required: false })
    @IsString()
    @IsOptional()
    ownRef?: string; 

    @ApiProperty({ example: 'AS30Dd2', required: false, default: null })
    @IsString()
    @IsOptional()
    refBy?: string;

    @ApiProperty({ example: ['AS30Dd2', 'ZX56Yn4'], required: false, default: null })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })  
    listRefs?: string[];
}
