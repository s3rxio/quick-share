import { staticConfig } from "@/config";
import { Share } from "@/shares/share.entity";
import { Exclude } from "class-transformer";
import { AfterInsert, Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "~/entities";

@Entity("files")
export class File extends BaseEntity {
  @Column({
    unique: true
  })
  name: string;

  @Column()
  originalName: string;

  @Column()
  mimeType: string;

  @Column()
  size: number;

  @Column({
    nullable: true,
    unique: true
  })
  downloadLink: string;

  @ManyToOne(() => Share, share => share.files, {
    nullable: true,
    createForeignKeyConstraints: false
  })
  @Exclude()
  share: Share;

  @AfterInsert()
  afterInsertActions() {
    this.downloadLink = new URL(
      `${staticConfig.api.url}/files/${this.id}/download`
    ).toString();
  }
}
