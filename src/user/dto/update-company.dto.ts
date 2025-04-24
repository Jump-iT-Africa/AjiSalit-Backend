import { ApiProperty } from "@nestjs/swagger";
import { UpdateUserDto } from "./update-user.dto";
import { IsString, IsNumber, IsNotEmpty } from 'class-validator'


export class UpdateCompanyDto extends UpdateUserDto {
    @ApiProperty({
        example: 'Jump it , Rabat',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: "Enter your address" })
    fullAddress: string

    @ApiProperty({
        example: 'خياط',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: "Please enter your field" })
    field: string

    @ApiProperty({
        example: '74839898090939393',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: "ICE number is required" })
    ice: string
}