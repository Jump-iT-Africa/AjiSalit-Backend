import { Expose } from "class-transformer";
export class ResponseUserDto{
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
    socketId?:string
    @Expose()
    expoPushToken?:string
}