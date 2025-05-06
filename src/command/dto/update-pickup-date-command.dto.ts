import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsOptional, Matches } from "class-validator";

export class UpdatepickUpDateCommandDto{
    @ApiProperty({
        example: "2025-10-28",
        required: true
    })
    @IsNotEmpty()
    pickupDate:string
}