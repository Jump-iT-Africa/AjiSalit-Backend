import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, IsOptional, IsArray, IsEnum, IsBoolean } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ example: 'OSM', required: true })
    @IsString()
    @IsNotEmpty()
    Fname: string;

    @ApiProperty({ example: 'BEN', required: true })
    @IsString()
    @IsNotEmpty()
    Lname: string;

    @ApiProperty({ example: 'Aji Salit', required: false })
    @IsOptional()
    companyName: string;

    @ApiProperty({ example: '+212697042868', required: true })
    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty({ example: '123456', required: true })
    @IsString()
    @IsNotEmpty()
    password: string;


    @ApiProperty({ example: 'company', required: true })
    @IsString()
    @IsOptional()
    @IsEnum(['admin', 'client', 'company'])
    role: string;


    @ApiProperty({ example: 'marrakech', required: true })
    @IsString()
    @IsOptional()
    city: string;

    @ApiProperty({ example: 'pressing', required: true })
    @IsString()
    @IsOptional()
    field: string;

    @ApiProperty({ example: '12345678910123', required: false })
    @IsString()
    @IsOptional()
    @Matches(/^\d{14}$/, { message: 'ICE خاص اكن فيه 14 لرقم' })
    ice: string;

    // @ApiProperty({ example: 'AS30Dd2', required: false })
    @IsString()
    @IsOptional()
    ownRef: string; 

    // @ApiProperty({ example: 'AS30Dd2', required: false, default: null })
    @IsString()
    @IsOptional()
    refBy: string;

    // @ApiProperty({ example: ['AS30Dd2', 'ZX56Yn4'], required: false, default: null })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    listRefs: string[]; 



   
}
