import { ApiProperty } from "@nestjs/swagger"
import { Date, Types } from "mongoose"

export class responseSiteInfoDTO{
    @ApiProperty({
        example: "6809076a0d062a9147e7eb4c",
        description: 'The id of the admin who created it'
      })
      adminId: Types.ObjectId

    @ApiProperty({
        example: "support",
        description: 'the title'
      })
    title: string

    @ApiProperty({
        example: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras placerat faucibus aliquam. Duis dapibus eleifend consequat. Pellentesque posuere nunc ac sapien eleifend tincidunt. Proin mollis leo ut nunc ultricies, eu scelerisque odio sodales. Aliquam vitae mauris ac sem hendrerit luctus sed molestie risus. Vestibulum suscipit felis sit amet turpis congue imperdiet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Proin sapien dui, cursus eu eleifend et, semper in sapien. Proin mattis ultrices suscipit.",
        description: 'the content of the section'
      })
    content: string

    @ApiProperty({
        example: "6809076a0d062a9147e7eb4c",
        description: 'The id of the website info '
      })
      _id: Types.ObjectId

      @ApiProperty({
        example: "saved",
        description: 'the status of the website info rather its drafted or saved'
      })
    status: string

    @ApiProperty({
        example: "2025-05-05T09:03:17.378Z",
        description: 'the creation Date of the website info'
      })
      createdAt: Date

      @ApiProperty({
        example: "2025-05-05T09:03:17.378Z",
        description: 'the update Date of the website info'
      })
      updatedAt: Date
 
    @ApiProperty({
        example:   0,
        description: "__v by default "
      })
    __v: 0
}