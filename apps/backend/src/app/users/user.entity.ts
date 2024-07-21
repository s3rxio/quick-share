import { Share } from "@/shares/share.entity";
import { Exclude } from "class-transformer";
import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "~/entities";
import { Role } from "~/enums";

@Entity("users")
export class User extends BaseEntity {
  @Column({
    unique: true
  })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    unique: true
  })
  email: string;

  // TODO: Add db roles and perms
  @Column({
    type: "enum",
    default: [Role.User],
    enum: Role,
    array: true
  })
  roles: Role[];

  @OneToMany(() => Share, share => share.user, {
    onDelete: "NO ACTION"
  })
  shares: Share[];
}
