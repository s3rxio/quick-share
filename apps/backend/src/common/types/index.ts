import { User } from "@/users/user.entity";
import { S3ClientConfig } from "@aws-sdk/client-s3";
import { JwtModuleOptions } from "@nestjs/jwt";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
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

export type JwtPayload<T> = T & {
  iat: number;
  exp: number;
};

export type TokenPayload = JwtPayload<Pick<User, "id" | "username" | "email">>;

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
};

export interface ApiConfig {
  host: string;
  port: number;
  url: string;
  root: {
    username: string;
    password: string;
  };
}

export type DbConfig = TypeOrmModuleOptions;
export type JwtConfig = JwtModuleOptions;
export interface BcryptConfig {
  saltRounds: number;
}
export interface S3Config extends S3ClientConfig {
  bucketName: string;
}

export interface Config {
  env: string;
  api: ApiConfig;
  db: DbConfig;
  jwt: JwtConfig;
  bcrypt: BcryptConfig;
  s3: S3Config;
}
