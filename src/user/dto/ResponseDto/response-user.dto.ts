import { Expose } from "class-transformer";
export class ResponseUserDto{
    @Expose()
    id:string
    @Expose()
    Fname:string
    @Expose()
    Lname:string
    @Expose()
    city:string
    @Expose()
    phoneNumber:string
    @Expose()
    role:string
    @Expose()
    expoPushToken?:string
    @Expose()
    pocket:number
    @Expose()
    ownRef?: string
    @Expose()
    socketId?: string
}