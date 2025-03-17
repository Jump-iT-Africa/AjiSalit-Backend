import { IsNotEmpty, IsString, IsOptional, IsEnum,IsMongoId, IsDateString} from "class-validator";
import { Types } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCommandDto {
    @ApiProperty({
        example: '67bda9260433e5b76e39de06',
        required: true
    })
    @IsOptional()
    @IsMongoId()
    companyId?:Types.ObjectId

    @IsOptional()
    @IsMongoId()
    userId?:Types.ObjectId

    @ApiProperty({
        example: '50000',
        required: true
    })
    @IsNotEmpty({message:"دخل تمن ديال هاد الخدمة"})
    price:number

    @ApiProperty({
        example: "تسبيق",
        required: true
    })
    @IsNotEmpty({message:"لازم دخل الحالة "})
    @IsEnum(["خالص", "غير خالص","تسبيق" ])
    situation:string

    @ApiProperty({
        example: "قيد الانتظار",
        required: true
    })
    @IsOptional()
    @IsString()
    @IsEnum(["في طور الانجاز","قيد الانتظار", "جاهزة للتسليم", "تم تسليم"])
    status:string

    @ApiProperty({
        example: 2000,
        required: false
    })    

    @IsOptional()
    advancedAmount:number

    @ApiProperty({
        example: "rabat",
        required: true
    })   
    @IsNotEmpty({message:"دخل المدينة"})
    @IsString({message:"دخل  إسم المدينة صحيح"})
    city:string

    @ApiProperty({
        example: "2025-10-26",
        required: true
    })
    @IsDateString({},{message:"تاريخ خاص اكون بحال YYYY-MM-DD"})
    @IsNotEmpty({message: "دخل تاريخ التسليم"})
    deliveryDate:string


    @ApiProperty({
        example: "2025-10-28",
        required: true
    })

    @IsOptional()
    images?: string[]

    @ApiProperty({
        example: "Hgdthej80000",
        required: true
    })

    @IsNotEmpty()
    qrCode:string



}
