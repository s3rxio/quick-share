export type PaginatedData<T> = {
  items: T[];
  total: number;
};

export interface BaseResponse<T> extends Partial<PaginatedData<T>> {
  message: string;
  data?: T;
}
