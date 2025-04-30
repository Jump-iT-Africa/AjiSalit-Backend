import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateFieldDto {
    @ApiProperty({
        example: "pressing",
        description: 'Field'
      })
    @IsString({message: "The field should be string"})
    @IsNotEmpty({message: "the field should not be empty"})
    field: string
}