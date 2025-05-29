import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsMongoId,
  IsDateString,
  IsArray,
  Matches,
  IsNumber,
  IsBoolean,
} from "class-validator";
import { Types } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateStatusCommandDto {
  @ApiProperty({
    example: "finished",
    required: true,
  })
  @IsString()
  @Matches(/^(inProgress|finished|delivered)$/, {
    message:
      "The status must be one of the following: inProgress, finished, delivered",
  })
  @IsEnum(["inProgress", "finished", "delivered"])
  status: string;
}
