import { DbConfig } from "@backend/common/types";
import { Share } from "../shares/share.entity";
import { User } from "../users/user.entity";
import { File } from "../files/file.entity";

export const dbConfig: DbConfig = {
  type: "postgres",
  host: process.env.QCKSHARE_DB_HOST,
  port: parseInt(process.env.QCKSHARE_DB_PORT, 10) || 5432,
  username: process.env.QCKSHARE_DB_USER,
  password: process.env.QCKSHARE_DB_PASSWORD,
  database: process.env.QCKSHARE_DB_NAME,
  entities: [User, Share, File],
  synchronize: true,
  cache: true
};
