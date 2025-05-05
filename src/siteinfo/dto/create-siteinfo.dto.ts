import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class CreateSiteInfoDto{
    @ApiProperty({ example: 'Support', required: true })
    @IsString({message: "The title should be string and shouldn't be empty"})
    title:string

    @ApiProperty({ example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras placerat faucibus aliquam. Duis dapibus eleifend consequat. Pellentesque posuere nunc ac sapien eleifend tincidunt. Proin mollis leo ut nunc ultricies, eu scelerisque odio sodales. Aliquam vitae mauris ac sem hendrerit luctus sed molestie risus. Vestibulum suscipit felis sit amet turpis congue imperdiet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Proin sapien dui, cursus eu eleifend et, semper in sapien. Proin mattis ultrices suscipit.', required: true })
    @IsString({message: "the content should be text or string"})
    @IsNotEmpty({message: "The content should not be empty"})
    content:string

    @IsOptional()
    @ApiProperty({ example: 'saved', required: true })
    @IsEnum(["saved", "draft" ])
    @Matches(/^(saved|draft)$/, { message: "The status should be either saved or draft" })
    status:string 
}