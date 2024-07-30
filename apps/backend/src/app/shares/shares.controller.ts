import {
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipeBuilder,
  ParseUUIDPipe,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { SharesService } from "./shares.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { SharesGuard } from "./shares.guard";
import { Response } from "express";
import { Public } from "@backend/common/decoratos";
import { staticConfig } from "../config";
import { User } from "../users/user.decorator";
import { User as UserEntity } from "../users/user.entity";

@Controller("shares")
export class SharesController {
  constructor(private readonly sharesService: SharesService) {}

  @Public()
  @Get(":id")
  async findOneById(@Param("id", ParseUUIDPipe) id: string) {
    return this.sharesService.findOneOrFail(id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor("files"))
  async upload(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: staticConfig.api.maxUploadSize
        })
        .build({
          fileIsRequired: true
        })
    )
    files: Express.Multer.File[],
    @User()
    user: UserEntity
  ) {
    return this.sharesService.upload(files, user);
  }

  @Public()
  @Get(":id/download")
  async download(
    @Param("id", ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.sharesService.download(id, res);
  }

  @UseGuards(SharesGuard)
  @Delete(":id")
  async delete(@Param("id", ParseUUIDPipe) id: string) {
    return this.sharesService.delete(id);
  }

  @UseGuards(SharesGuard)
  @Post(":id/files")
  @UseInterceptors(FilesInterceptor("files"))
  async addFiles(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: staticConfig.api.maxUploadSize
        })
        .build({
          fileIsRequired: true
        })
    )
    files: Express.Multer.File[],
    @Param("id", ParseUUIDPipe)
    id: string
  ) {
    return this.sharesService.addFiles(id, files);
  }

  @UseGuards(SharesGuard)
  @Delete(":id/files/:fileId")
  async deleteFile(
    @Param("id", ParseUUIDPipe) id: string,
    @Param("fileId", ParseUUIDPipe) fileId: string
  ) {
    return this.sharesService.deleteFile(id, fileId);
  }
}
