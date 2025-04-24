import { Expose } from "class-transformer";
export class ResponseUserDto{
    @Expose()
    name:string
    @Expose()
    phoneNumber:string
    @Expose()
    role:string
    @Expose()
    socketId?:string
}