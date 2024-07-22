import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InjectS3, S3 } from "nestjs-s3";
import { Repository } from "typeorm";
import { File } from "./file.entity";
import { ObjectCannedACL } from "@aws-sdk/client-s3";
import { Response } from "express";
import { Share } from "@/shares/share.entity";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File) private readonly repository: Repository<File>,
    @InjectS3() private readonly s3: S3,
    private readonly configService: ConfigService
  ) {}

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

      await this.s3.putObject({
        Bucket: this.configService.get<string>("s3.bucketName"),
        Key: fileEntity.name,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: ObjectCannedACL.public_read
      });

      this.repository.update(fileEntity.id, {
        downloadLink: fileEntity.downloadLink
      });

      filesEntities.push(fileEntity);
    }

    return filesEntities;
  }

  /* 
    TODO: REDO!
     - https://docs.nestjs.com/techniques/streaming-files
    */
  async download(id: string, res: Response) {
    const file = await this.findOneOrFail(id);

    const endpoint = this.configService.get<string>("s3.endpoint");
    const bucketName = this.configService.get<string>("s3.bucketName");

    const directLink = new URL(`${endpoint}/${bucketName}/${file.name}`);

    res.redirect(new URL(directLink).toString());
  }

  async delete(id: string) {
    const file = await this.findOneOrFail(id);

    await this.s3.deleteObject({
      Bucket: this.configService.get<string>("s3.bucketName"),
      Key: file.name
    });

    return this.repository.delete({ id });
  }
}
