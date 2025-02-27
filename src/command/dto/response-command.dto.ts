import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export default class ResponseDto {
  @ApiProperty({
    example: '67bda9260433e5b76e39de06',
    description: 'companyId is the id of the company that creates an order',
    required: true,
  })
  companyId: Types.ObjectId;

  @ApiProperty({
    example: '50000',
    description: 'Price of the service',
    required: true,
  })
  price: number;

  @ApiProperty({
    example: 'تسبيق',
    description: 'The situation of the order and it can be advanced, paid or not paid',
    required: true,
  })
  situation: string;

  @ApiProperty({
    example: 'قيد الانتظار',
    description: 'The current status of the order',
    required: true,
  })
  status: string;

  @ApiProperty({
    example: 2000,
    description: 'advanced amount if it\'s already given',
    required: false,
  })
  advancedAmount?: number;

  @ApiProperty({
    example: 'rabat',
    description: 'city related to the service',
    required: true,
  })
  city: string;

  @ApiProperty({
    example: '2025-10-26',
    description: 'Delivery date of the service',
    required: true,
  })
  deliveryDate: string;

  @ApiProperty({
    example: ['image1.jpg', 'image2.jpg'],
    description: 'images URLs related to the service',
    required: false,
    type: [String],
  })
  images?: string[];

  @ApiProperty({
    example: '67bf398590bd476466de96c0',
    description: 'unique identifier of the order',
    required: true,
  })
  _id: string;

  @ApiProperty({
    example: '67bca1a1b3c6a150efad2045',
    description: 'user ID related to the order, null if not scanned',
    nullable: true,
    required: false,
  })
  userId?: Types.ObjectId | null;
}
