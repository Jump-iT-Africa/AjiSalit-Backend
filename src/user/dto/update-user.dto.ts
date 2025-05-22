import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, IsEnum, IsOptional,IsArray, IsNumber,IsBoolean } from "class-validator";

export class UpdateUserDto {
    @ApiProperty({ example: 'Test test', required: false })
    @IsString()
    @IsOptional()  
    Fname?: string;

    @ApiProperty({ example: 'jest jest', required: false })
    @IsString()
    @IsOptional()  
    Lname?: string;

    @ApiProperty({ example: 'image.jpg', required: false })
    @IsString()
    @IsOptional()
    image?: string;
    
    @ApiProperty({ example: 'Alee', required: false })
    @IsString()
    @IsOptional()  
    companyName?: string;

    @ApiProperty({ example: '+212600000000', required: false })
    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @ApiProperty({ example: '12456', required: false })
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

    @ApiProperty({ example: 'pressing', required: false })
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

    @IsString()
    @IsOptional()
    refBy?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })  
    listRefs?: string[];

    @IsOptional()
    @IsString()
    expoPushToken: string;

   
}
