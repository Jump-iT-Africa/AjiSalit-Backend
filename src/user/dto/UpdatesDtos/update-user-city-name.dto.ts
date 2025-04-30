import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateCityDto {
    @ApiProperty({
        example: "Rabat",
        description: 'city'
      })
    @IsString({message: "The city name should be string"})
    @IsNotEmpty({message: "The city name can not be empty"})
    city: string
}