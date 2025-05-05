import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
export class ResoponseUpdateCompanyDto{
    @ApiProperty({
        example: "680f62b232fece2dacde63fe",
        description: 'Id of user'
      })
    @Expose()
    id:string

    @ApiProperty({
        example: "+212698888333",
        description: 'last name'
      })
    @Expose()
    phoneNumber:string

    @ApiProperty({
        example: "Salimaa",
        description: 'first name'
      })
    @Expose()
    Fname:string

    @ApiProperty({
        example: "BHM",
        description: 'last name'
      })
    @Expose()
    Lname:string


    @ApiProperty({
        example: "Salima's Holding",
        description: 'company name'
      })
    @Expose()
    companyName:string

    @ApiProperty({
        example:[],
        description: 'list reference'
      })
    @Expose()
    listRefs: string[]

    @ApiProperty({
        example:"company",
        description: "role"
      })
    @Expose()
    role:string

    @ApiProperty({
        example:"pressing",
        description: "Field"
      })
    @Expose()
    field:string

    @ApiProperty({
        example:"89849838984983989389839",
        description: "ice"
      })
    @Expose()
    ice:string

    @ApiProperty({
        example:"339F81EE",
        description: "ownRef"
      })
    @Expose()
    ownRef:string

    @ApiProperty({
        example:"Azrou",
        description: "city"
      })
    @Expose()
    city:string

}