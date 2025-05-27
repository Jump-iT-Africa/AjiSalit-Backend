import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateQuizzDto{
    @IsString({message: "the question should be valid string"})
    @IsNotEmpty({message: "the question shouldn't be empty"})
    question: string;
    @IsString({message: "the reply should be valid string"})
    @IsNotEmpty({message: "the reply shouldn't be empty"})
    reply:string;
    @IsNotEmpty({message: "the number of points shouldn't be empty"})
    @IsNumber({},{message: "the number of points should be a number"})
    points:number;
    @IsBoolean({message: "the status should be boolean"})
    status:boolean;
}