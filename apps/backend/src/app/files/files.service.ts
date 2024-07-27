import { Config, S3Config } from "~/types";
import {
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationBootstrap
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InjectS3, S3 } from "nestjs-s3";
import { Repository } from "typeorm";
import { File } from "./file.entity";
import { ObjectCannedACL } from "@aws-sdk/client-s3";
import { Response } from "express";
import { Share } from "@/shares/share.entity";
import { ConfigService } from "@nestjs/config";
import JsZip from "jszip";
import { Readable } from "node:stream";
import ms from "ms";

@Injectable()
export class FilesService implements OnApplicationBootstrap {
  private readonly zip = new JsZip();

  constructor(
    @InjectRepository(File) private readonly repository: Repository<File>,
    @InjectS3() private readonly s3: S3,
    private readonly configService: ConfigService<Config>
  ) {}

  async onApplicationBootstrap() {
    const bucketName = this.configService.get("s3.bucketName", { infer: true });

    try {
      const maxExpitration =
        this.configService.get("api.share.expiration.max", {
          infer: true
        }) / ms("1d");
      const oneDay = 1;
      const expitration =
        maxExpitration >= oneDay ? Math.trunc(maxExpitration) : oneDay;

      await this.s3
        .getBucketLocation({ Bucket: bucketName })
        .catch(() => this.createBucket(bucketName, expitration));

      const {
        Rules: [lifecycleRule]
      } = await this.s3.getBucketLifecycleConfiguration({
        Bucket: bucketName
      });

      if (lifecycleRule.Expiration.Days !== expitration) {
        await this.putBucketExpiration(
          bucketName,
          expitration,
          lifecycleRule.ID
        );

        Logger.log("Updated S3 bucket expiration");
      }
    } catch (error) {
      Logger.error("Failed to connect or configure S3 bucket");
      throw error;
    }
  }

  async findOneOrFail(id: string) {
    const file = await this.repository.findOneBy({ id });

    if (!file) {
      throw new NotFoundException();
    }

    return file;
  }

  async upload(files: Express.Multer.File[], share: Share) {
    const filesEntities: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const [fileName, ...fileExts] = file.originalname.split(".");

      const randomNumber = Math.round(Math.random() * 100);
      const name = `${fileName}-${Date.now()}${i}${randomNumber}.${fileExts.join(
        "."
      )}`;

      const fileEntity = await this.repository
        .create({
          name,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          share: share
        })
        .save();

      await this.uploadS3Object(fileEntity.name, file.mimetype, file.buffer);

      this.repository.update(fileEntity.id, {
        downloadLink: fileEntity.downloadLink
      });

      filesEntities.push(fileEntity);
    }

    return filesEntities;
  }

  async download(id: string, res: Response) {
    const file = await this.findOneOrFail(id);

    res.redirect(this.getS3ObjectUrl(file.name));
  }

  async delete(id: string) {
    const file = await this.findOneOrFail(id);

    await this.s3.deleteObject({
      Bucket: this.configService.get("s3.bucketName", { infer: true }),
      Key: file.name
    });

    return this.repository.delete({ id });
  }

  private async createBucket(name: string, expitration = 1) {
    await this.s3.createBucket({
      Bucket: name,
      ACL: "public-read"
    });

    await this.putBucketExpiration(name, expitration);

    await this.s3.putBucketPolicy({
      Bucket: name,
      Policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "PublicReadGetObject",
            Effect: "Allow",
            Principal: {
              AWS: ["*"]
            },
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${name}/*`]
          }
        ]
      })
    });
  }

  private putBucketExpiration(
    bucketName: string,
    expitration?: number,
    id?: string
  ) {
    return this.s3.putBucketLifecycleConfiguration({
      Bucket: bucketName,
      LifecycleConfiguration: {
        Rules: [
          {
            ID: id,
            Status: "Enabled",
            Filter: {
              Prefix: "/"
            },
            Expiration: {
              Days: expitration
            }
          }
        ]
      }
    });
  }

  private getS3Object(key: string) {
    return this.s3.getObject({
      Bucket: this.configService.get("s3.bucketName", { infer: true }),
      Key: key
    });
  }

  private uploadS3Object(
    key: string,
    contentType: string,
    body: string | Uint8Array | Buffer | Readable | ReadableStream | Blob
  ) {
    return this.s3.putObject({
      Bucket: this.configService.get("s3.bucketName", { infer: true }),
      Key: key,
      Body: body,
      ContentType: contentType,
      ACL: ObjectCannedACL.public_read
    });
  }

  private getS3ObjectUrl(key: string) {
    const { endpoint, bucketName } = this.configService.get<S3Config>("s3");

    return new URL(`${endpoint}/${bucketName}/${key}`).toString();
  }

  async createArchive(files: File[], share: Share): Promise<File> {
    const s3Files = await Promise.all(
      files.map(
        async file =>
          await this.getS3Object(file.name).then(async x => ({
            name: file.originalName,
            body: await x.Body.transformToByteArray()
          }))
      )
    );

    s3Files.forEach(file => this.zip.file(file.name, file.body));

    const archive = await this.zip.generateAsync({
      type: "blob"
    });

    const archiveName = `${share.id}.zip`;

    await this.uploadS3Object(
      archiveName,
      archive.type,
      Buffer.from(await archive.arrayBuffer())
    );

    const archiveEntity = await this.repository
      .create({
        name: archiveName,
        originalName: archiveName,
        mimeType: archive.type,
        size: archive.size,
        share: share
      })
      .save();

    await this.repository.update(archiveEntity.id, {
      downloadLink: archiveEntity.downloadLink
    });

    return archiveEntity;
  }
}
