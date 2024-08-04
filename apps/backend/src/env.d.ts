import { MsLikeTime } from "~/types/index";
export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: string;

      QCKSHARE_API_HOST?: string;
      QCKSHARE_API_PORT?: string;
      QCKSHARE_API_URL?: string;

      QCKSHARE_API_ROOT_USERNAME?: string;
      QCKSHARE_API_ROOT_PASSWORD?: string;

      QCKSHARE_API_SHARE_EXPIRATION_DEFAULT?: MsLikeTime;
      QCKSHARE_API_SHARE_EXPIRATION_MAX?: MsLikeTime;

      QCKSHARE_DB_HOST?: string;
      QCKSHARE_DB_PORT?: string;
      QCKSHARE_DB_USER?: string;
      QCKSHARE_DB_PASSWORD?: string;
      QCKSHARE_DB_NAME?: string;

      QCKSHARE_JWT_SECRET?: string;

      QCKSHARE_BCRYPT_SALT_ROUNDS?: string;

      QCKSHARE_S3_ACCESS_KEY?: string;
      QCKSHARE_S3_SECRET_KEY?: string;
      QCKSHARE_S3_ENDPOINT?: string;
      QCKSHARE_S3_REGION?: string;
      QCKSHARE_S3_BUCKET_NAME?: string;

      QCKSHARE_ENV_PATH: string;
    }
  }
}
