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

  generateResponse<T extends Record<string, unknown>>(
    statusCode: HttpStatus,
    data?: T
  ): BaseResponse<T> {
    const message =
      typeof data === "string"
        ? data
        : Object.keys(HttpStatus)
            .find(key => HttpStatus[key] === statusCode)
            .split("_")
            .join(" ");

    const res = {
      statusCode,
      message
    };

    if (!data || typeof data === "string") {
      return res;
    }

    const isPaginated =
      typeof data === "object" &&
      Array.isArray(data.items) &&
      parseInt(data.total as string, 10);

    if (isPaginated) {
      return {
        ...res,
        ...data
      };
    }

    return {
      ...res,
      data
    };
  }
}
