import { Expose } from "class-transformer";
export class ResoponseCompanyDto{
    @Expose()
    name:string
    @Expose()
    phoneNumber:string
    @Expose()
    fullAddress:string
    @Expose()
    field:string
    @Expose()
    ice:number
    @Expose()
    role:string
}