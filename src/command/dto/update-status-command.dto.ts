import { IsNotEmpty, IsString, IsOptional, IsEnum,IsMongoId, IsDateString , IsArray, Matches, IsNumber, IsBoolean} from "class-validator";
import { Types } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateStatusCommandDto {
    @ApiProperty({
        example: "جاهزة للتسليم",
        required: true
    })
    @IsString()
    @Matches(/^(في طور الانجاز|قيد الانتظار|جاهزة للتسليم|تم تسليم)$/, { message: "The status must be one of the following: في طور الانجاز, قيد الانتظار, جاهزة للتسليم, تم تسليم" })
    @IsEnum(["في طور الانجاز","قيد الانتظار", "جاهزة للتسليم", "تم تسليم"])
    status:string

}
