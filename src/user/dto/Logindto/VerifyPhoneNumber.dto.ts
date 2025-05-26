import { IsNotEmpty, IsString, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class VerifyNumberDto {
  @ApiProperty({ example: '+212697042868', required: true })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+212\s?(?:0?[567]\d{8,9})$/, {
    message: "the phone number is not valid it has to be like +212697042868 or like +2120697042868",
  })
  phoneNumber: string;
}