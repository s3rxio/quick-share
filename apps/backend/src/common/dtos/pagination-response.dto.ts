import { PaginatedData } from "../types";

export class PaginationResponse<T> implements PaginatedData<T> {
  items: T[];
  total: number;

  constructor(items: T[], total?: number) {
    this.items = items;
    this.total = total || items.length;
  }
}
