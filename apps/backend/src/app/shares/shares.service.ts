import { FilesService } from "@/files/files.service";
import {
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationBootstrap
} from "@nestjs/common";
import { Share } from "./share.entity";
import { FindManyOptions, LessThanOrEqual, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import ms from "ms";
import { Request, Response } from "express";

@Injectable()
export class SharesService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Share) private readonly repository: Repository<Share>,
    private readonly filesService: FilesService
  ) {}

  async onApplicationBootstrap() {
    await this.cleanup();

    setInterval(async () => await this.cleanup(), ms("12h"));
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

  async upload(files: Express.Multer.File[], req: Request) {
    const share = this.repository.create({
      expiresAt: new Date(Date.now() + ms("12h")),
      user: req["user"]
    });

    const filesEntities = await this.filesService.upload(files, share);
    share.files = filesEntities;

    return this.repository.save(share);
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

    if (share.archive) {
      share.files.push(share.archive);
    }

    await Promise.all(
      share.files.map(file => this.filesService.delete(file.id))
    );

    return this.repository.delete({ id });
  }

  async download(id: string, res: Response) {
    const share = await this.findOneOrFail(id);

    if (share.files.length === 1) {
      return res.redirect(share.files[0].downloadLink);
    }

    if (!share.archive) {
      share.archive = await this.filesService.createArchive(share.files, share);

      await this.repository.update({ id }, { archive: share.archive });
    }

    return res.redirect(share.archive.downloadLink);
  }

  async cleanup() {
    Logger.log("Cleaning up expired shares...");
    const shares = await this.findAllExpired();

    for (let i = 0; i < shares.length; i++) {
      await this.delete(shares[i].id);
    }

    Logger.log("Done cleaning up expired shares.");
  }
}
