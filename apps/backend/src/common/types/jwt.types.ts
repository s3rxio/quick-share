import { User } from "@/users/user.entity";

export type JwtPayload<T> = T & {
  iat: number;
  exp: number;
};

export type TokenPayload = JwtPayload<Pick<User, "id" | "username" | "email">>;
