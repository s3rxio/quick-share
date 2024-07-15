import { User } from "@/users/user.entity";
import { BaseEntity, FindOptionsWhere } from "typeorm";

export type Where<E extends BaseEntity> = FindOptionsWhere<E>;

export type Criteria<E extends BaseEntity = never> =
  | string
  | number
  | FindOptionsWhere<E>;

export type JwtPayload<T> = T & {
  iat: number;
  exp: number;
};

export type TokenPayload = JwtPayload<Pick<User, "id" | "username" | "email">>;
