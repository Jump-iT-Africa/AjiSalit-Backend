import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";

export class responseStatusDTO {
  @ApiProperty({
    example: "6809076a0d062a9147e7eb4c",
    description: "Command Id",
  })
  _id: Types.ObjectId;

  @ApiProperty({
    example: "680673aa30cbfdd8aa2b1676",
    description: "Commpany id",
  })
  companyId: Types.ObjectId;

  @ApiProperty({
    example: "68091f687844071f178dc266",
    description: "Client id",
  })
  clientId: Types.ObjectId;

  @ApiProperty({
    example: "PREPAYMENT",
    description: "situation",
  })
  situation: string;

  @ApiProperty({
    example: "FINISHED",
    description: "status",
  })
  status: string;

  @ApiProperty({
    example: 9000,
    description: "adavncedAmount",
  })
  advancedAmount: number;

  @ApiProperty({
    example: 90000,
    description: "price",
  })
  price: number;
  @ApiProperty({
    example: [],
    description: "images",
  })
  images?: string[];
  @ApiProperty({
    example: "2025-04-27T00:00:00.000Z",
    description: "Delivery Date",
  })
  estimatedDeliveryDate: string;
  @ApiProperty({
    example: "2025-04-27T00:00:00.000Z",
    description: "Pick up date",
  })
  pickupDate: string;
  @ApiProperty({
    example: "Yhjhkh8hiuy8y88",
    description: "qrcode",
  })
  qrCode: string;

  @ApiProperty({
    example: 0,
    description: "__v by default ",
  })
  __v: 0;
}
