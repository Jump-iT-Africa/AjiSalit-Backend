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
    socketId?:string
}