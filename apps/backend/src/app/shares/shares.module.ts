import { Module } from "@nestjs/common";
import { SharesController } from "./shares.controller";
import { SharesService } from "./shares.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Share } from "./share.entity";
import { FilesModule } from "../files/files.module";
import { File } from "../files/file.entity";
import { ShareSubscriber } from "./share.subscriber";

@Module({
  providers: [SharesService, ShareSubscriber],
  controllers: [SharesController],
  imports: [TypeOrmModule.forFeature([Share, File]), FilesModule],
  exports: [TypeOrmModule]
})
export class SharesModule {}
