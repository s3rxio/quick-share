import { Exclude } from "class-transformer";
import { Column, Entity } from "typeorm";
import { BaseEntity } from "~/entities/base.entity";

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
}
