// import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
// import { Observable } from "rxjs";

// @Injectable()
// export class CommandInterceptor implements NestInterceptor{
//    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any>{
//        console.log("here we are trying interceptors")
//        let body = context.switchToHttp().getRequest().body
//        console.log("here's the body of my request", body)

//    } 
// }