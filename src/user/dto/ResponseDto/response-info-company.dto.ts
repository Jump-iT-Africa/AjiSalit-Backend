import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
export class ResoponseCompanyInfoDto{
    @ApiProperty({
        example: "Jump It",
        description: 'The name of company'
      })
    @Expose()
    companyName:string
    @ApiProperty({
        example: "Bouhamidi",
        description: 'the last name'

    })
    @Expose()
    Lname:string
    @ApiProperty({
        example: "Salima",
        description: 'the first name'
    })
    @Expose()
    Fname:string
    @ApiProperty({
        example: "+212 697042868",
        description: 'Phone number'
    })
    @Expose()
    phoneNumber:string
    @ApiProperty({
        example: "Azrou",
        description: 'City'
    })
    @Expose()
    city:string
    @ApiProperty({
        example: "company",
        description: 'the role of user'
    })
    @Expose()
    role:string
    @ApiProperty({
        example: 250,
        description: "Pocket's balance"
    })
    @Expose()
    pocket:number
}