import { User } from "@/users/user.entity";
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne
} from "typeorm";
import { BaseEntity } from "~/entities";
import { File } from "@/files/file.entity";
import { Exclude } from "class-transformer";

@Entity("shares")
export class Share extends BaseEntity {
  @OneToOne(() => File, file => file.share, {
    eager: true,
    nullable: true,
    createForeignKeyConstraints: false
  })
  @JoinColumn({
    name: "archiveId"
  })
  archive: File | null = null;

  @OneToMany(() => File, file => file.share, {
    eager: true,
    nullable: true
  })
  files: File[];

  @ManyToOne(() => User, user => user.shares, {
    nullable: false
  })
  @JoinColumn({
    name: "userId"
  })
  user: User;

  @Column("timestamptz")
  expiresAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;
}
