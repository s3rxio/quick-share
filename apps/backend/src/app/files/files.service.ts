import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InjectS3, S3 } from "nestjs-s3";
import { Repository } from "typeorm";
import { File } from "./file.entity";
import { ObjectCannedACL } from "@aws-sdk/client-s3";
import { Response } from "express";
import { Share } from "@/shares/share.entity";

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File) private readonly repository: Repository<File>,
    @InjectS3() private readonly s3: S3
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

      const fileEntity = this.repository.create({
        name: `${fileName}-${Date.now()}.${fileExts.join(".")}`,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        share: share
      });

      await this.s3.putObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileEntity.name,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: ObjectCannedACL.public_read
      });

      filesEntities.push(fileEntity);
    }

    return this.repository.save(filesEntities);
  }

  /* 
    TODO: REDO!
     - https://docs.nestjs.com/techniques/streaming-files
    */
  async download(id: string, res: Response) {
    const file = await this.findOneOrFail(id);

    const directLink = new URL(
      `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET_NAME}/${file.name}`
    );

    res.redirect(new URL(directLink).toString());
  }

  async delete(id: string) {
    const file = await this.findOneOrFail(id);

    await this.s3.deleteObject({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: file.name
    });

    return this.repository.delete({ id });
  }
}
