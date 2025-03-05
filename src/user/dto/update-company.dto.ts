import { UpdateUserDto } from "./update-user.dto";
import { IsString, IsNumber, IsNotEmpty } from 'class-validator'


export class UpdateCompanyDto extends UpdateUserDto{
            @IsString()
            @IsNotEmpty({message: "دخل العنوان و المدينة ديالك"})
            fullAddress: string
    
            @IsString()
            @IsNotEmpty({message: "دخل المجال ديالك"})
            field:string
    
            @IsNumber()
            @IsNotEmpty({message: "خصك دخل رقم البطاقة الضريبية أو رقم ICE"})
            ice:number
}