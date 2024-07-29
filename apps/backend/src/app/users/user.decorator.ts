import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User as UserEntity } from "./user.entity";

export type UserKeys = keyof UserEntity;

export const User = createParamDecorator(
  (value: UserKeys | UserKeys[] | null, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest();

    if (Array.isArray(value)) {
      return value.reduce((acc, curr) => {
        acc[curr] = user[curr];
        return acc;
      }, {} as Partial<UserEntity>);
    }

    return value ? user[value] : user;
  }
);
