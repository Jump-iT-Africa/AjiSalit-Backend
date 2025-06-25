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
  MinLength,
  isBoolean,
} from "class-validator";
import { Types } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class CreateCommandDto {
  @IsOptional()
  @IsMongoId()
  companyId?: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  userId?: Types.ObjectId;

  @ApiProperty({
    example: 8000,
    required: true,
  })
  @IsNotEmpty({ message: "kindly add the price of this service" })
  @IsNumber({}, { message: "The price has to be a valid number " })
  price: number;

  @ApiProperty({
    example: "PREPAYMENT",
    required: true,
  })
  @IsNotEmpty({ message: "you must add the situation" })
  @IsEnum(["PAID", "UNPAID", "PREPAYMENT"])
  @Matches(/^(PAID|UNPAID|PREPAYMENT)$/, {
    message:
      "The situation must be one of the following: PAID, UNPAID, PREPAYMENT",
  })
  situation: string;

  @ApiProperty({
    example: "INPROGRESS",
    required: true,
  })
  @IsOptional()
  @IsString()
  @Matches(/^(INPROGRESS|FINISHED|ARCHIVED|EXPIRED)$/, {
    message:
      "The status must be one of the following: INPROGRESS,FINISHED, ARCHIVED or EXPIRED",
  })
  @IsEnum(["INPROGRESS", "FINISHED", "ARCHIVED", "EXPIRED"])
  status: string;

  @ApiProperty({
    example: 200,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: "The Advanced Amount has to be a valid number " })
  @Transform(({ value }) => value === "" ? null : value)
  advancedAmount: number;

  @ApiProperty({
    example: "2025-10-26",
    required: false,
  })
  @IsDateString({}, { message: "The date has to  be on this : YYYY-MM-DD" })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "The date must be in the format YYYY-MM-DD",
  })
  @Transform(({ value }) => value === "" ? null : value)
  estimatedDeliveryDate: string;

  @ApiProperty({
    example: "2025-10-28",
    required: false,
  })
  @IsDateString({}, { message: "The pickup date has to  be on this : YYYY-MM-DD" })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "The pickup date must be in the format YYYY-MM-DD",
  })
  @IsOptional()
  @Transform(({ value }) => value === "" ? null : value)
  pickupDate: string;

  @ApiProperty({ type: "string", format: "binary", required: false })
  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  @Transform(({ value }) => value === "" ? [] : value)
  images?: string[];

  @ApiProperty({
    example: "Poco Loco",
    required: true,
  })
  @IsNotEmpty()
  qrCode: string;

  @IsBoolean()
  @IsOptional()
  isConfirmedByClient: boolean;

  @ApiProperty({
    example: "true",
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isDateChanged: boolean;

  @ApiProperty({
    example: "sick",
    required: false,
  })
  @IsString()
  @IsOptional()
  ChangeDateReason?: string;

  @ApiProperty({
    example: "2025-10-30",
    required: true,
  })
  @IsDateString({}, { message: "The date has to  be on this : YYYY-MM-DD" })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "The date must be in the format YYYY-MM-DD",
  })
  @IsOptional()
  newEstimatedDeliveryDate: string;
}
