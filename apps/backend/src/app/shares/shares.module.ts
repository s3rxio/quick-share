import { Module } from "@nestjs/common";
import { SharesController } from "./shares.controller";
import { SharesService } from "./shares.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Share } from "./share.entity";
import { FilesModule } from "@/files/files.module";
import { File } from "@/files/file.entity";

@Module({
  providers: [SharesService],
  controllers: [SharesController],
  imports: [TypeOrmModule.forFeature([Share, File]), FilesModule],
  exports: [TypeOrmModule]
})
export class SharesModule {}
