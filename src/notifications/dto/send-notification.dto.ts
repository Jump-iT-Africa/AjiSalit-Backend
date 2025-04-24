import { ApiProperty } from "@nestjs/swagger";
import {  IsNotEmpty, IsString } from "class-validator";
export class sendNotificationDto {
    @ApiProperty({
        example: "AjiSalit",
        description: 'title of notification',
    })
    title: string

    @ApiProperty({
        example: "Your order has been completed successfully.",
        description: 'Message to send in the notification',
    })
    @IsString({ message: 'The message should be String' })
    message: string

    @ApiProperty({
        example: "ExponentPushToken[aQcWD3F4ELNDS0gbiHccgh]",
        description: 'the expo push notification',
    })
    @IsString({ message: 'The expo push token should be String' })
    @IsNotEmpty({ message: "The expo push shouldn't be empty" })
    expoPushToken: string

}
