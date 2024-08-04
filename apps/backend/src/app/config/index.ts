import { Config } from "@backend/common/types";
import { inB } from "@quick-share/inb";
import { s3Config } from "./s3.config";
import { bcryptConfig } from "./bcrypt.config";
import { jwtConfig } from "./jwt.config";
import { dbConfig } from "./db.config";
import { shareConfig } from "./share.config";
import { rootConfig } from "./root.config";

export const getConfig = (): Config => ({
  env: process.env.NODE_ENV || "development",
  host: process.env.QCKSHARE_API_HOST || "localhost",
  port: parseInt(process.env.QCKSHARE_API_PORT, 10) || 3000,
  url: process.env.QCKSHARE_API_URL || `http://localhost:3000/api`,
  maxUploadSize: inB(process.env.QCKSHARE_API_MAX_UPLOAD_SIZE || "1GB"),
  root: rootConfig,
  share: shareConfig,
  db: dbConfig,
  jwt: jwtConfig,
  bcrypt: bcryptConfig,
  s3: s3Config
});
