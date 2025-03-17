import { IsDefined, IsNotEmpty, IsString } from "class-validator";
export class CreateNotificationDto {

    @IsString({message:'The message should be String'})
    @IsNotEmpty({message:"The message shouldn't be empty"})
    message:string
}
