export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: string;

      API_HOST?: string;
      API_PORT?: string;

      DB_HOST?: string;
      DB_PORT?: number;
      DB_USER?: string;
      DB_PASSWORD?: string;
      DB_NAME?: string;

      JWT_SECRET?: string;

      BCRYPT_SALT_ROUNDS?: string;
    }
  }
}
