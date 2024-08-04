import {
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationBootstrap
} from "@nestjs/common";
import { Share } from "./share.entity";
import { FindManyOptions, LessThanOrEqual, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";
import { FilesService } from "../files/files.service";
import { User } from "../users/user.entity";
import { Interval } from "@nestjs/schedule";
import { getConfig } from "../config";
import { SharesCleanupTask } from "./shares.const";

@Injectable()
export class SharesService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SharesService.name);

  constructor(
    @InjectRepository(Share) private readonly repository: Repository<Share>,
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  async onApplicationBootstrap() {
    await this.cleanup();
  }

  async findAll(options: FindManyOptions<Share>) {
    return this.repository.find(options);
  }

  findAllExpired() {
    return this.repository.find({
      where: {
        expiresAt: LessThanOrEqual(new Date())
      }
    });
  }

  async upload(files: Express.Multer.File[], user: User) {
    const share = await this.repository
      .create({
        expiresAt: new Date(
          Date.now() +
            this.configService.get<number>("share.expiration.default")
        ),
        user
      })
      .save();

    await this.filesService.upload(files, share);
    await share.reload();

    return share;
  }

  async findOne(id: string) {
    return this.repository.findOne({
      where: {
        id
      },
      relations: ["user"]
    });
  }

  async findOneOrFail(id: string) {
    const share = await this.findOne(id);

    if (!share) {
      throw new NotFoundException();
    }

    if (share.expiresAt < new Date()) {
      await this.delete(id);
      throw new NotFoundException();
    }

    return share;
  }

  async delete(id: string) {
    const share = await this.findOne(id);

    if (!share) {
      throw new NotFoundException();
    }

    await this.repository.remove(share);
  }

  async download(id: string, res: Response) {
    const share = await this.findOneOrFail(id);

    if (share.files.length === 1) {
      return res.redirect(share.files[0].downloadLink);
    }

    const archive = await this.filesService.createArchive(
      share.files,
      share.id
    );

    res.attachment(archive.name).send(archive.buffer);

    return;
  }

  async addFiles(id: string, files: Express.Multer.File[]) {
    const share = await this.findOneOrFail(id);

    await this.filesService.upload(files, share);
    await share.reload();

    return share;
  }

  async deleteFile(id: string, fileId: string) {
    const share = await this.findOneOrFail(id);

    await this.filesService.delete(fileId);
    await share.reload();

    return share;
  }

  @Interval(SharesCleanupTask, getConfig().share.expiration.default)
  private async cleanup() {
    this.logger.log("Cleaning up expired shares...");
    const shares = await this.findAllExpired();

    for (let i = 0; i < shares.length; i++) {
      await this.delete(shares[i].id);
    }

    this.logger.log("Done cleaning up expired shares.");
  }
}
