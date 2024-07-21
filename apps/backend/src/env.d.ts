export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: string;

      API_HOST?: string;
      API_PORT?: string;
      API_URL?: string;
      API_ROOT_USERNAME?: string;
      API_ROOT_PASSWORD?: string;

      DB_HOST?: string;
      DB_PORT?: number;
      DB_USER?: string;
      DB_PASSWORD?: string;
      DB_NAME?: string;

      JWT_SECRET?: string;

      BCRYPT_SALT_ROUNDS?: string;

      S3_ACCESS_KEY?: string;
      S3_SECRET_KEY?: string;
      S3_ENDPOINT?: string;
      S3_REGION?: string;
      S3_BUCKET_NAME?: string;
    }
  }
}
