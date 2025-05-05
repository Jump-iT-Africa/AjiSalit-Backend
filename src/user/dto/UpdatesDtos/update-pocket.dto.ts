import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPositive, Min } from "class-validator";

export class UpdatePocketBalance{
    @ApiProperty({
        example:230,
        description: "The pocket price of company"
    })
    @IsNumber({},{message:"the pocket price must be a valid number"})
    @IsNotEmpty({message: "The pocket number should not be empty and should be a valid number"})
    @Min(0,{message: "The pocket number should be positive or 0 "})
    pocket: number
}