import { Expose } from "class-transformer";
export class ResoponseCompanyDto{
    @Expose()
    id:string
    @Expose()
    Fname:string
    @Expose()
    Lname:string
    @Expose()
    companyName:string
    @Expose()
    city:string
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
    @Expose()
    expoPushToken?:string
    @Expose()
    pocket:number
    @Expose()
    socketId?: string
    @Expose()
    image:string
}