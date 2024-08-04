import { BaseResponse } from "@backend/common/types";
import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor
} from "@nestjs/common";
import { Response } from "express";
import { map } from "rxjs/operators";

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, BaseResponse<T>>
{
  intercept(context: ExecutionContext, next: CallHandler) {
    const { statusCode } = context.switchToHttp().getResponse<Response>();

    return next
      .handle()
      .pipe(map(data => this.generateResponse(statusCode, data)));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generateResponse(statusCode: HttpStatus, data?: any): BaseResponse<T> {
    const message =
      typeof data === "string"
        ? data
        : Object.keys(HttpStatus)
            .find(key => HttpStatus[key] === statusCode)
            .split("_")
            .join(" ");

    const res = {
      message
    };

    if (!data || typeof data === "string") {
      return res;
    }

    const isPaginated = typeof data === "object" && Array.isArray(data.items);

    if (isPaginated) {
      return {
        ...res,
        ...data,
        total: data.total || data.items.length
      };
    }

    return {
      ...res,
      data
    };
  }
}