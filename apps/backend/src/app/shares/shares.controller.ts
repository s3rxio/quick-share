import {
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipeBuilder,
  ParseUUIDPipe,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { SharesService } from "./shares.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { SharesGuard } from "./shares.guard";
import { Request } from "express";

@Controller("shares")
export class SharesController {
  constructor(private readonly sharesService: SharesService) {}

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
          maxSize: 1000 * 1000 * 115
        })
        .build({
          fileIsRequired: true
        })
    )
    files: Express.Multer.File[],
    @Req()
    req: Request
  ) {
    return this.sharesService.upload(files, req);
  }

  @UseGuards(SharesGuard)
  @Delete(":id")
  async delete(@Param("id", ParseUUIDPipe) id: string) {
    return this.sharesService.delete(id);
  }
}
