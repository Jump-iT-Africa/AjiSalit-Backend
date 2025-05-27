import { Expose } from "class-transformer";
export class ResoponseAdminDto{
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
    fullAddress:string
    @Expose()
    role:string
    @Expose()
    socketId:string
    @Expose()
    expoPushToken:string


}