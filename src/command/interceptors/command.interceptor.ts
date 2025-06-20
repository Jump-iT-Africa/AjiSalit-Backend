import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class CommandInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> {
    const body = context.switchToHttp().getRequest().body;
    if (typeof body.price === "string") {
      body.price = Number(body.price);
    }
    if (body.advancedAmount) {
      if (typeof body.advancedAmount === "string") {
        body.advancedAmount = Number(body.advancedAmount);
      }
    }
    if (typeof body.isDateChanged === "string") {
      if (body.isDateChanged == "true") {
        body.isDateChanged = true;
      } else {
        body.isDateChanged = false;
      }
    }
    return next.handle();
  }
}
