import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsOptional, Matches } from "class-validator";

export class UpdatepickUpDateCommandDto{
    @ApiProperty({
        example: "2025-10-28",
        required: true
    })
    @IsNotEmpty()
    @IsDateString({},{message: "The date has be not empty and to  be on this format: YYYY-MM-DD"})
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: "The date must be in the format YYYY-MM-DD" })
    pickupDate:string
}