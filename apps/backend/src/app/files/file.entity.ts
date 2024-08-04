import { BaseEntity } from "@backend/common/entities";
import { Exclude } from "class-transformer";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Share } from "../shares/share.entity";

@Entity("files")
export class File extends BaseEntity {
  @Column({
    unique: true
  })
  path: string;

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
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "shareId"
  })
  @Exclude()
  share: Share;
}
