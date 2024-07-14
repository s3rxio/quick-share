import { PrimaryGeneratedColumn } from "typeorm";
import { TimestampedEntity } from "./timestamped.entity";

export abstract class BaseEntity extends TimestampedEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
}
