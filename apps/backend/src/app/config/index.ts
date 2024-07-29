import { Config } from "@backend/common/types";
import { inB } from "@quick-share/inb";
import ms from "ms";
import { Share } from "../shares/share.entity";
import { User } from "../users/user.entity";
import { File } from "../files/file.entity";

export const staticConfig = {
  api: {
    host: process.env.API_HOST || "localhost",
    port: parseInt(process.env.API_PORT, 10) || 3000,
    url: process.env.API_URL || `http://localhost:3000/api`,
    maxUploadSize: inB(process.env.API_MAX_UPLOAD_SIZE || "1GB")
  }
};

export const getConfig = (): Config => ({
  env: process.env.NODE_ENV || "development",
  api: {
    ...staticConfig.api,
    root: {
      username: process.env.API_ROOT_USERNAME || "root",
      password: process.env.API_ROOT_PASSWORD || "rootPass123"
    },
    share: {
      expiration: {
        default: ms(process.env.API_SHARE_EXPIRATION_DEFAULT || "12h"),
        max: ms(process.env.API_SHARE_EXPIRATION_MAX || "7d")
      }
    }
  },
  db: {
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Share, File],
    synchronize: true
  },
  jwt: {
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: "1d" }
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10
  },
  s3: {
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY
    },
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION || undefined,
    forcePathStyle: true,
    bucketName: process.env.S3_BUCKET_NAME
  }
});
