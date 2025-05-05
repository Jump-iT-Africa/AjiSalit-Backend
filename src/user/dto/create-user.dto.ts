import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, IsOptional, IsArray, IsEnum, IsPhoneNumber, IsBoolean, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ example: 'OSM', required: true })
    @IsString()
    // @Matches(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/, { message: "Your first name must be valid name" })
    // @MinLength(3, { message: 'The first name must be at least 3 characters long' })
    @IsNotEmpty()
    Fname: string;

    @ApiProperty({ example: 'BEN', required: true })
    @IsString()
    // @Matches(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/, { message: "Your last name must be valid name" })
    // @MinLength(3, { message: 'The last name must be at least 3 characters long' })
    @IsNotEmpty()
    Lname: string;

    @ApiProperty({ example: 'Aji Salit', required: false })
    // @Matches(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/, { message: "Your company must be valid company name with alphabets" })
    // @MinLength(3, { message: 'The last name must be at least 3 characters long' })
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
    // @Matches(/^[A-Za-z]+$/, { message: "you must provid a valid cityname" })
    @IsOptional()
    city: string;

    @ApiProperty({ example: 'pressing', required: true })
    // @Matches(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/, { message: "Field must be a valid field" })
    @IsString()
    @IsOptional()
    field: string;

    @ApiProperty({ example: '12345678910123', required: false })
    @IsString()
    @IsOptional()
    @Matches(/^\d{14}$/, { message: "the ICE must contains 14 numbers" })
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

    @IsOptional()
    @IsString()
    expoPushToken: string;
}
