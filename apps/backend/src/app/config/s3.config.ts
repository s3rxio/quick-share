import { S3Config } from "@backend/common/types";

export const s3Config: S3Config = {
  credentials: {
    accessKeyId: process.env.QCKSHARE_S3_ACCESS_KEY,
    secretAccessKey: process.env.QCKSHARE_S3_SECRET_KEY
  },
  endpoint: process.env.QCKSHARE_S3_ENDPOINT,
  region: process.env.QCKSHARE_S3_REGION || undefined,
  forcePathStyle: true,
  bucketName: process.env.QCKSHARE_S3_BUCKET_NAME
};
