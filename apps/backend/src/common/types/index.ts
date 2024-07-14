import { BaseEntity, FindOptionsWhere, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export type Where<E extends BaseEntity> = FindOptionsWhere<E>;

export type Criteria<E extends BaseEntity = never> =
  | string
  | number
  | FindOptionsWhere<E>;

export interface CrudServiceType<E extends BaseEntity> {
  repository: Repository<E>;

  findAll(where?: Where<E>): Promise<E[]>;
  findOne(where: Where<E>): Promise<E>;

  create(entity: E): Promise<E>;
  update(criteria: Criteria<E>, entity: QueryDeepPartialEntity<E>);
  delete(criteria: Criteria<E>);
}
