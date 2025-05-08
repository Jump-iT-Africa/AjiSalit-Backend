import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Types } from "mongoose";
import { User } from "../../user/entities/user.schema";

export class ResponseCommandAndCompanyDTO {
  @ApiProperty({
    description: "Company information",
    type: "object",
    properties: {
      _id: { type: "string", example: "681b604799836f72f332ceb9" },
      companyName: { type: "string", example: "deals" },
      field: { type: "string", nullable: true },
    },
  })
  @Expose()
  companyId: User;

  @ApiProperty({
    example: "50000",
    description: "Price of the service",
    required: true,
  })
  @Expose()
  price: number;

  @ApiProperty({
    example: "تسبيق",
    description:
      "The situation of the order and it can be advanced, paid or not paid",
    required: true,
  })
  @Expose()
  situation: string;

  @ApiProperty({
    example: "جاهزة للتسليم",
    description: "The current status of the order",
    required: true,
  })
  @Expose()
  status: string;

  @ApiProperty({
    example: 2000,
    description: "advanced amount if it's already given",
    required: false,
  })
  advancedAmount?: number;

  @ApiProperty({
    example: "2025-10-26",
    description: "Delivery date of the service",
    required: true,
  })
  @Expose()
  deliveryDate: string;
  @ApiProperty({
    example: null,
    description: "it will be unpdated in the pick up date",
    required: true,
  })
  @Expose()
  pickupDate: string;

  @ApiProperty({
    example: ["image.jpg", "image2.jpg"],
    description: "images URLs related to the service",
    required: false,
  })
  @Expose()
  images?: string[];

  @ApiProperty({
    example: "null",
    description: "client ID related to the order, null if not scanned",
    nullable: true,
  })
  @Expose()
  clientId?: Types.ObjectId | null;

  @ApiProperty({
    example: "true",
    required: false,
  })
  isDateChanged: boolean;

  @ApiProperty({
    example: "sick",
    required: false,
  })
  ChangeDateReason: string;

  @ApiProperty({
    example: null,
    description: "the new changed date",
    required: true,
  })
  newDate: string;

  @ApiProperty({
    example: 0,
    description: "__v by default ",
  })
  __v: 0;

  @ApiProperty({
    example: "6809076a0d062a9147e7eb4c",
    description: "The id if the command",
  })
  _id: Types.ObjectId;
}
