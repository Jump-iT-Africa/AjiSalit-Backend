import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsString } from "class-validator";
export class CreateNotificationDto {

    @ApiProperty({
        example: "Your order has been completed successfully.",
        description: 'Message to send in the notification',
        required: true,
    })
    @IsString({ message: 'The message should be String' })
    @IsNotEmpty({ message: "The message shouldn't be empty" })
    message: string
}
