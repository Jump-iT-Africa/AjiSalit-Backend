import {
  IsString,
  IsEnum,
  Matches,
} from "class-validator";
import { Types } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateStatusCommandDto {
  @ApiProperty({
    example: "FINISHED",
    required: true,
  })
  @IsString({message: "The status must be one of the following: INPROGRESS,FINISHED, ARCHIVED or EXPIRED"})
  @Matches(/^(INPROGRESS|FINISHED|ARCHIVED|EXPIRED)$/, { message: "The status must be one of the following: INPROGRESS,FINISHED, ARCHIVED or EXPIRED"})
  @IsEnum(["INPROGRESS", "FINISHED", "ARCHIVED", "EXPIRED"])
  status: string;
}
