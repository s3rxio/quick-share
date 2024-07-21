import { FilesService } from "../files/files.service";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Share } from "./share.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { REQUEST } from "@nestjs/core";
import ms from "ms";

@Injectable()
export class SharesService {
  constructor(
    @InjectRepository(Share) private readonly repository: Repository<Share>,
    @Inject(REQUEST) private req: Request,
    private readonly filesService: FilesService
  ) {}

  async findAll() {
    return this.repository.find();
  }

  async upload(files: Express.Multer.File[]) {
    const share = this.repository.create({
      expiresAt: new Date(Date.now() + ms("7d")), // 7 days from now.
      user: this.req["user"]
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

    const promises = [];
    share.files.forEach(file => {
      promises.push(this.filesService.delete(file.id));
    });

    await Promise.all(promises);

    return this.repository.delete({ id });
  }
}
