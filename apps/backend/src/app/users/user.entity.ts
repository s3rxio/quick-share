import { Exclude } from "class-transformer";
import { Column, Entity } from "typeorm";
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
}
