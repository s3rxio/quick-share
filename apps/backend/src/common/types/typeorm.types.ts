import { BaseEntity, FindOptionsWhere } from "typeorm";

export type Where<E extends BaseEntity> = FindOptionsWhere<E>;

export type Criteria<E extends BaseEntity = never> =
  | string
  | number
  | FindOptionsWhere<E>;

export type SelectByString<E extends BaseEntity> = keyof Omit<
  E,
  keyof BaseEntity
>;
