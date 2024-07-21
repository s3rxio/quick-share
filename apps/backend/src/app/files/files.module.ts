import { Module } from "@nestjs/common";
import { FilesService } from "./files.service";
import { FilesController } from "./files.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { File } from "./file.entity";
import { Share } from "@/shares/share.entity";

@Module({
  providers: [FilesService],
  controllers: [FilesController],
  imports: [TypeOrmModule.forFeature([File, Share])],
  exports: [TypeOrmModule, FilesService]
})
export class FilesModule {}
