import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  DataSource,
  RemoveEvent
} from "typeorm";
import { File } from "./file.entity";
import { FilesService } from "./files.service";
import { ConfigService } from "@nestjs/config";

@EventSubscriber()
export class FileSubscriber implements EntitySubscriberInterface<File> {
  constructor(
    dataSource: DataSource,
    private readonly filesService: FilesService,
    private readonly configServise: ConfigService
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return File;
  }

  afterInsert(event: InsertEvent<File>) {
    const { entity, manager } = event;

    manager.update(File, entity.id, {
      downloadLink: new URL(
        `${this.configServise.get("api.url")}/files/${entity.id}/download`
      ).toString()
    });
  }

  /* 
    Doesn't work if deleted in cascade
    https://github.com/typeorm/typeorm/issues/4419
  */
  beforeRemove(event: RemoveEvent<File>) {
    const entity = event.entity || event.databaseEntity;

    if (!entity) {
      return;
    }

    return this.filesService.deleteS3Object(entity.name);
  }
}
