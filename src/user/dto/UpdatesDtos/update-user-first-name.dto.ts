import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateFirstNameDto {
    @ApiProperty({
        example: "Salimaa",
        required: true
    })
    @IsString({message: "The first name should be string"})
    @IsNotEmpty({message: "the first name is required and shouldn't be empty"})
    Fname: string
}