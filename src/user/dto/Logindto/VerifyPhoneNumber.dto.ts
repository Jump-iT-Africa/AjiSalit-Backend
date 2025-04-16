import { IsNotEmpty, IsString, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class VerifyNumberDto {
  @ApiProperty({ example: '+212697042868', required: true })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+212\s?0?\d{9}$/, {
    message: 'رقم الهاتف غير صالح، خاصو يكون على شكل +212 0697042868 أو +2120697042868',
  })
  phoneNumber: string;
}
