import { User } from "@/users/user.entity";
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany
} from "typeorm";
import { BaseEntity } from "~/entities";
import { File } from "@/files/file.entity";
import { Exclude } from "class-transformer";

@Entity("shares")
export class Share extends BaseEntity {
  @OneToMany(() => File, file => file.share, {
    eager: true,
    nullable: true
  })
  files: File[];

  @ManyToOne(() => User, user => user.shares, {
    nullable: false
  })
  user: User;

  @Column("timestamptz")
  expiresAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;
}
