import { HttpStatus } from "@nestjs/common";

export type PaginatedData<T> = {
  items: T[];
  total: number;
};

export interface BaseResponse<T> extends Partial<PaginatedData<T>> {
  statusCode: HttpStatus;
  message: string;
  data?: T;
}
