import { ApiProperty } from "@nestjs/swagger";
import { UpdateUserDto } from "./update-user.dto";
import { IsString, IsNumber, IsNotEmpty } from 'class-validator'


export class UpdateCompanyDto extends UpdateUserDto {
    @ApiProperty({
        example: 'Jump it , Rabat',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: "دخل العنوان و المدينة ديالك" })
    fullAddress: string

    @ApiProperty({
        example: 'خياط',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: "دخل المجال ديالك" })
    field: string

    @ApiProperty({
        example: '74839898090939393',
        required: true
    })
    @IsNumber()
    @IsNotEmpty({ message: "خصك دخل رقم البطاقة الضريبية أو رقم ICE" })
    ice: number
}