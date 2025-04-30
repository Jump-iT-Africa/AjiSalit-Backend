import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateCompanyNameDto {
    @ApiProperty({
        example: "SBD's holding",
        description: 'company name'
      })
    @IsString({message: "The company name should be string"})
    @IsNotEmpty({message: "The company name can not be empty"})
    companyName: string
}