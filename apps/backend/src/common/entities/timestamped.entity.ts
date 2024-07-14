import {
  BaseEntity as TOBaseEntity,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

export abstract class TimestampedEntity extends TOBaseEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
