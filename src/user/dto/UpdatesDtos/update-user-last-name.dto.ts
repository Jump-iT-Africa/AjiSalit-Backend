import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateLastNameDto {
    @ApiProperty({
        example: "Bouhamidi",
        required: true
    })
    @IsString({message: "The last name should be string"})
    @IsNotEmpty({message: "the last name is required and shouldn't be empty"})
    Lname: string
}