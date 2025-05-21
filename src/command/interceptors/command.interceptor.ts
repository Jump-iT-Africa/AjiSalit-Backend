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
    console.log("here we are trying interceptors");
    const body = context.switchToHttp().getRequest().body;
    console.log("here's the body of my request", body);
    if (typeof body.price === "string") {
      body.price = Number(body.price);
    }
    if (body.advancedAmount) {
      if (typeof body.advancedAmount === "string") {
        body.advancedAmount = Number(body.advancedAmount);
      }
    }
    if (typeof body.isExpired === "string") {
      if (body.isExpired == "true") {
        body.isExpired = true;
      } else {
        body.isExpired = false;
      }
    }
    if (typeof body.isFinished === "string") {
      if (body.isFinished == "true") {
        body.isFinished = true;
      } else {
        body.isFinished = false;
      }
    }
    if (typeof body.isPickUp === "string") {
      if (body.isPickUp == "true") {
        body.isPickUp = true;
      } else {
        body.isPickUp = false;
      }
    }
    if (typeof body.isDateChanged === "string") {
      if (body.isDateChanged == "true") {
        body.isDateChanged = true;
      } else {
        body.isDateChanged = false;
      }
    }
    console.log("Modified body", body);

    return next.handle();
  }
}
