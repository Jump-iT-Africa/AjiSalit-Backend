import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class ResponseFlag{
    @Expose()
    @ApiProperty({
        example: "Wallet section",
        description: "This represent the wallet section"
    })
    title : string
    @Expose()
    @ApiProperty({
        example: true,
        description: "This describe if the section is visible or not"
    })
    isVisible: boolean
}