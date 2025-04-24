import { IsNotEmpty, IsString, IsOptional, IsEnum,IsMongoId, IsDateString , IsArray, Matches, IsNumber, IsBoolean, MinLength} from "class-validator";
import { Types } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCommandDto {
    
    @IsOptional()
    @IsMongoId()
    companyId?:Types.ObjectId

    @IsOptional()
    @IsMongoId()
    userId?:Types.ObjectId

    @ApiProperty({
        example: 8000,
        required: true
    })
    @IsNotEmpty({message:"kindly add the price of this service"})
    @IsNumber({},{message:"The price has to be a valid number "})
    price:number

    @ApiProperty({
        example: "تسبيق",
        required: true
    })
    @IsNotEmpty({message:"you must add the situation"})
    @IsEnum(["خالص", "غير خالص","تسبيق" ])
    @Matches(/^(خالص|غير خالص|تسبيق)$/, { message: "The situation must be one of the following: خالص, غير خالص, تسبيق" })
    situation:string

    @ApiProperty({
        example: "في طور الانجاز",
        required: true
    })
    @IsOptional()
    @IsString()
    @Matches(/^(في طور الانجاز|جاهزة للتسليم|تم تسليم)$/, { message: "The status must be one of the following: قيد الانتظار, جاهزة للتسليم, تم تسليم" })
    @IsEnum(["في طور الانجاز", "جاهزة للتسليم", "تم تسليم"])
    status:string

    @ApiProperty({
        example: 200,
        required: false
    })    

    @IsOptional()
    @IsNumber({},{message:"The Advanced Amount has to be a valid number "})
    advancedAmount:number

    @ApiProperty({
        example: "rabat",
        required: true
    })   
    @IsNotEmpty({message:"The city Name can not be empty, please enter your city name"})
    @MinLength(3, { message: 'The city must be at least 3 characters long' })
    @Matches(/^[A-Za-z]+$/, { message: "you must provid a valid cityname" })
    @IsString()
    city:string

    @ApiProperty({
        example: "2025-10-26",
        required: true
    })
    @IsDateString({},{message:"The date has to  be on this : YYYY-MM-DD"})
    @IsNotEmpty({message: "The delivery Date is required"})
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: "The date must be in the format YYYY-MM-DD" })
    deliveryDate:string

    @ApiProperty({
        example: "2025-10-28",
        required: true
    })
    @IsDateString({},{message:"The date has to  be on this : YYYY-MM-DD"})
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: "The date must be in the format YYYY-MM-DD" })
    @IsOptional()
    pickupDate:string

    @ApiProperty({
        example: ['image1.jpg', 'image2.jpg'],
        description: 'images URLs related to the service',
        required: false,
        type: [String],
    })
    @IsOptional()
    @IsString({ each: true })
    @IsArray()
    images?: string[]

    @ApiProperty({
        example: "Hgdthej80000",
        required: true
    })
    @IsNotEmpty()
    qrCode:string

    @IsBoolean()
    @IsOptional()
    isFinished:boolean

    @IsBoolean()
    @IsOptional()
    isPickUp:boolean
}
