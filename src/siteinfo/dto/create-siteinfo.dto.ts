import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class CreateSiteInfoDto{
    @IsString({message: "The title should be string"})
    title:string

    @IsString({message: "the content should be text or string"})
    @IsNotEmpty({message: "The content should not be empty"})
    content:string

    @IsOptional()
    @IsEnum(["saved", "draft" ])
    @Matches(/^(saved|draft)$/, { message: "The status should be either saved or draft" })
    status:string 
}