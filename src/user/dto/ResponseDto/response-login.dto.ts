import { Expose } from "class-transformer";
export class ResponseLoginDto{

    @Expose()
    _id:string
    @Expose()
    phoneNumber:string
    @Expose()
    role:string
    @Expose()
    isVerified:boolean
    @Expose()
    fullAddress:string
    @Expose()
    field:string
    @Expose()
    ice:number
    @Expose()
    name:string
}
