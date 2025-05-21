import {
    BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class FlagInterceptor implements NestInterceptor {
  intercept( context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const body = context.switchToHttp().getRequest().body;
    if(body === undefined || Object.keys(body).length == 0){
     throw new BadRequestException("The body should not be empty")
    }
    return next.handle();
  }
}
