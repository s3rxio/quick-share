import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { User } from "./user.entity";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { ExceptionMessage, Role } from "~/enums";
import { ListUsersOptionsDto } from "./dtos/list-users-options.dto";
import { Where } from "~/types";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>
  ) {}

  async findAll(options?: FindManyOptions<User> | ListUsersOptionsDto) {
    const { skip, take, order: orderOption, select, ...rest } = options;

    const isDto = options instanceof ListUsersOptionsDto;

    const order = isDto
      ? {
          [options.orderBy]: orderOption
        }
      : options.order;

    delete (rest as ListUsersOptionsDto).orderBy;

    const where = isDto ? (rest as Where<User>) : options.where;
    const restOptions = isDto ? {} : options;

    return this.repository.find({
      where,
      select,
      skip,
      take,
      order,
      ...restOptions
    });
  }

  async findOne(options: FindOneOptions<User>) {
    return this.repository.findOne(options);
  }

  async findOneOrFail(options: FindOneOptions<User>) {
    const user = await this.repository.findOne(options);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async findOneById(id: string) {
    return this.findOne({
      where: {
        id
      }
    });
  }

  async findOneByIdOrFail(id: string) {
    return this.findOneOrFail({
      where: {
        id
      }
    });
  }

  async create(dto: CreateUserDto) {
    await this.existByOrFail({ username: dto.username }, { email: dto.email });

    const user = this.repository.create(dto);

    return this.repository.save(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOneByIdOrFail(id);

    await this.existByOrFail(
      { username: dto.username || "" },
      { email: dto.email || "" }
    );

    return this.repository.update({ id }, dto);
  }

  async delete(id: string) {
    await this.findOneByIdOrFail(id);

    return this.repository.delete({ id });
  }

  async existByOrFail(...where: Where<User>[]) {
    const isExist = await this.repository.existsBy(where);

    if (isExist) {
      throw new ConflictException(ExceptionMessage.AlreadyExists);
    }

    return isExist;
  }

  generateHash(password: string) {
    return bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS));
  }

  async seed() {
    const rootIsExist = await this.repository.existsBy({
      username: process.env.API_ROOT_USERNAME || "root"
    });

    const count = await this.repository.count();
    if (rootIsExist || count > 0) {
      return;
    }

    const rootUser = this.repository.create({
      username: process.env.API_ROOT_USERNAME || "root",
      email: `${
        process.env.API_ROOT_EMAIL || process.env.API_ROOT_USERNAME
      }@localhost`,
      password: await this.generateHash(
        process.env.API_ROOT_PASSWORD || "root"
      ),
      roles: [Role.Admin]
    });

    await this.repository.save(rootUser);
  }
}
