import { Controller, Get, Param, Res } from "@nestjs/common";
import { FilesService } from "./files.service";
import { Response } from "express";
import { Public } from "@backend/common/decoratos";

@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.filesService.findOneOrFail(id);
  }

  @Public()
  @Get(":id/download")
  async download(@Param("id") id: string, @Res() res: Response) {
    return this.filesService.download(id, res);
  }
}
