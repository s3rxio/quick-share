import {
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipeBuilder,
  ParseUUIDPipe,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { SharesService } from "./shares.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { SharesGuard } from "./shares.guard";
import { Request, Response } from "express";
import { Public } from "~/decoratos";

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

  @Public()
  @Get(":id/download")
  async download(@Param("id", ParseUUIDPipe) id: string, @Res() res: Response) {
    return this.sharesService.download(id, res);
  }

  @UseGuards(SharesGuard)
  @Delete(":id")
  async delete(@Param("id", ParseUUIDPipe) id: string) {
    return this.sharesService.delete(id);
  }
}
