import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

export class CreateFlagDtos{
    @ApiProperty({
        example:'Wallet section',
        description: "This represents the wallet section"
    })

    @IsString({message: "The title suppose to be string"})
    title:string;
    @ApiProperty({
        example: true,
        description: "This status implements the flipping feature as it's name said rather it's visible or not"
    })
    @IsBoolean({message: "The status of isVisible suppose to be True or False"})
    isVisible: boolean
    
}