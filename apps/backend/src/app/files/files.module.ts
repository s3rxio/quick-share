import { Module } from "@nestjs/common";
import { FilesService } from "./files.service";
import { FilesController } from "./files.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { File } from "./file.entity";
import { Share } from "../shares/share.entity";
import { FileSubscriber } from "./file.subscriber";

@Module({
  providers: [FilesService, FileSubscriber],
  controllers: [FilesController],
  imports: [TypeOrmModule.forFeature([File, Share])],
  exports: [TypeOrmModule, FilesService]
})
export class FilesModule {}
