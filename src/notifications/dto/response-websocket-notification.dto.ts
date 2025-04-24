import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
export class ResponseNotificationZwbSocket{

    @ApiProperty({
        example: "67d94bd7567f4c7c7a207c51",
        description: 'id of sender',
    })
    senderId: Types.ObjectId;

    @ApiProperty({
        example: '67d949596f68ef0a9892f91e',
        description: 'id of reciever',
    })
    recipientId: Types.ObjectId;

    @ApiProperty({
        example: 'Your order has been completed successfully',
        description: 'the message of the notification',
    })
    message: string;

    @ApiProperty({
        example: false,
        description: 'the status of notification is it seen or not',
    })
    read:boolean

    @ApiProperty({
        example: "67dc0944729af5dae8b5393c",
        description: 'the  id of notification',
    })
    _id:Types.ObjectId
    @ApiProperty({
      example:"2025-03-20T12:25:40.629Z",
      description:"Date and time of creation "
    })
    createdAt: Date

    @ApiProperty({
        example:"2025-03-20T12:25:40.629Z",
        description:"Date and time of update "
      })
      updatedAt: Date

      @ApiProperty({
        example:0,
      })
      __v:number



}