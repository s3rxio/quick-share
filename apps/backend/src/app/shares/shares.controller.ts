import {
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipeBuilder,
  ParseUUIDPipe,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { SharesService } from "./shares.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { SharesGuard } from "./shares.guard";
import { Public } from "~/decoratos";

@Public()
@Controller("shares")
export class SharesController {
  constructor(private readonly sharesService: SharesService) {}

  @Get(":id")
  async findOneById(@Param("id", ParseUUIDPipe) id: string) {
    return this.sharesService.findOneOrFail(id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor("file"))
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
    files: Express.Multer.File[]
  ) {
    return this.sharesService.upload(files);
  }

  @UseGuards(SharesGuard)
  @Delete(":id")
  async delete(@Param("id", ParseUUIDPipe) id: string) {
    return this.sharesService.delete(id);
  }
}
