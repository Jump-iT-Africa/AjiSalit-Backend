import { Expose } from "class-transformer";
export class ResponseLoginDto{

    @Expose()
    id:string
    @Expose()
    phoneNumber:string
    @Expose()
    Fname:string
    @Expose()
    Lname:string
    @Expose()
    companyName: string
    @Expose()
    listRefs:[]
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
    @Expose()
    ownRef:string
    @Expose()
    refBy:string
    @Expose()
    city:string
}

