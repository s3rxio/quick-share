import { S3ClientConfig } from "@aws-sdk/client-s3";
import { JwtModuleOptions } from "@nestjs/jwt";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export interface ApiConfig {
  host: string;
  port: number;
  url: string;
  root: {
    username: string;
    password: string;
  };
  share: {
    expiration: {
      default: number;
      max: number;
    };
  };
  maxUploadSize: number;
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
