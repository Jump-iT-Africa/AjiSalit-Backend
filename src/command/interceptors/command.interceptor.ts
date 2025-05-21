import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class CommandInterceptor implements NestInterceptor {
  intercept( context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    console.log("here we are trying interceptors");
    const body = context.switchToHttp().getRequest().body;
    console.log("here's the body of my request", body);
    if (typeof body.price === "string") {
      body.price = Number(body.price);
    }
    if(body.advancedAmount){
    if (typeof body.advancedAmount === "string") {
      body.advancedAmount = Number(body.advancedAmount);
    }
    if(typeof body.isExpired === 'string'){
      body.isExpired = Boolean(body.isExpired)
    }
    if(typeof body.isFinished === 'string'){
      body.isFinished = Boolean(body.isFinished)
    }
      if(typeof body.isPickUp === 'string'){
      body.isPickUp = Boolean(body.isPickUp)
    }
    if(typeof body.isDateChanged === 'string'){
      body.isDateChanged = Boolean(body.isDateChanged)
    }
    }
    console.log("Modified body", body);


    return next.handle();
  }
}
