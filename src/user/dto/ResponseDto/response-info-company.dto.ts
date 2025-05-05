import { Expose } from "class-transformer";
export class ResoponseCompanyInfoDto{
    @Expose()
    companyName:string
    @Expose()
    Lname:string
    @Expose()
    Fname:string
    @Expose()
    phoneNumber:string
    @Expose()
    city:string
    @Expose()
    role:string
    @Expose()
    pocket:number
}