import { PrimaryGeneratedColumn } from "typeorm";
import { TimestampedEntity } from "./timestamped.entity";
import { IsUUID } from "class-validator";

export abstract class BaseEntity extends TimestampedEntity {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  id: string;
}
