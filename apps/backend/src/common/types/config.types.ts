import { S3ClientConfig } from "@aws-sdk/client-s3";
import { JwtModuleOptions } from "@nestjs/jwt";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export interface shareConfig {
  expiration: {
    default: number;
    max: number;
  };
}

export interface RootConfig {
  username: string;
  password: string;
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
  host: string;
  port: number;
  url: string;
  maxUploadSize: number;

  root: RootConfig;
  share: shareConfig;
  db: DbConfig;
  jwt: JwtConfig;
  bcrypt: BcryptConfig;
  s3: S3Config;
}
