import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class updateStatusConfirmationDto {
  @ApiProperty({
    description: "the client confirm that he recieved his order as well",
    example: true,
  })
  @IsBoolean({ message: "it has to be boolean either true or false" })
  isConfirmedByClient: Boolean;
}
