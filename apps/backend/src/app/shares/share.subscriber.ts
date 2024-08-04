import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  RemoveEvent
} from "typeorm";
import { FilesService } from "../files/files.service";
import { Share } from "./share.entity";

@EventSubscriber()
export class ShareSubscriber implements EntitySubscriberInterface<Share> {
  constructor(
    dataSource: DataSource,
    private readonly filesService: FilesService
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Share;
  }

  // Only for file deletion
  afterRemove(event: RemoveEvent<Share>) {
    const entity = event.entity || event.databaseEntity;

    entity?.files?.forEach(file => this.filesService.deleteS3Object(file.path));
  }
}
