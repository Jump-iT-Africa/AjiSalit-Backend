import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";

export default class ResponseDto {
  companyId: Types.ObjectId;

  @ApiProperty({
    example: "50000",
    description: "Price of the service",
    required: true,
  })
  price: number;

  @ApiProperty({
    example: "PAID",
    description:
      "The situation of the order and it can be advanced, PAID or not PAID",
    required: true,
  })
  situation: string;

  @ApiProperty({
    example: "FINISHED",
    description: "The current status of the order",
    required: true,
  })
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
  estimatedDeliveryDate: string;
  
  @ApiProperty({
    example: null,
    description: "it will be unpdated in the pick up date",
    required: true,
  })
  pickupDate: string;

  @ApiProperty({
    example: ["image.jpg", "image2.jpg"],
    description: "images URLs related to the service",
    required: false,
  })
  images?: string[];

  @ApiProperty({
    example: "null",
    description: "user ID related to the order, null if not scanned",
    nullable: true,
    required: false,
  })
  userId?: Types.ObjectId | null;

  @ApiProperty({
    example: "true",
    required: false,
  })
  isDateChanged: boolean;

  @ApiProperty({
    example: "true",
    required: false,
  })
  isConfirmedByClient: boolean;

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
  newEstimatedDeliveryDate: string;

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
