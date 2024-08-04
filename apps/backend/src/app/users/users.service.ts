import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationBootstrap
} from "@nestjs/common";
import { User } from "./user.entity";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { ListUsersOptionsDto } from "./dtos/list-users-options.dto";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { ExceptionMessage, Role } from "@backend/common/enums";
import { Where, PaginatedData } from "@backend/common/types";
import { PaginationResponse } from "@backend/common/dtos";

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    private readonly configService: ConfigService
  ) {}

  onApplicationBootstrap() {
    this.seed();
  }

  async findAll(
    options?: FindManyOptions<User> | ListUsersOptionsDto
  ): Promise<PaginatedData<User>> {
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

    const [users, count] = await this.repository.findAndCount({
      where,
      select,
      skip,
      take,
      order,
      ...restOptions
    });

    return new PaginationResponse<User>(users, count);
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

    if (dto.password) {
      dto.password = await this.generateHash(dto.password);
    }

    return this.repository.update({ id }, dto);
  }

  async delete(id: string) {
    const user = await this.findOneByIdOrFail(id);

    await this.repository.remove(user);
  }

  async existByOrFail(...where: Where<User>[]) {
    const isExist = await this.repository.existsBy(where);

    if (isExist) {
      throw new ConflictException(ExceptionMessage.AlreadyExists);
    }

    return isExist;
  }

  generateHash(password: string) {
    return bcrypt.hash(
      password,
      this.configService.get<number>("bcrypt.saltRounds")
    );
  }

  async seed() {
    const rootUsername = this.configService.get<string>("root.username");

    const rootIsExist = await this.repository.existsBy({
      username: rootUsername
    });

    const count = await this.repository.count();
    if (rootIsExist || count > 0) {
      return;
    }

    this.logger.log("Seeding users...");

    await this.repository.save({
      username: rootUsername,
      email: `${rootUsername}@localhost`,
      password: await this.generateHash(
        this.configService.get<string>("root.password")
      ),
      roles: [Role.Admin]
    });

    this.logger.log("Seeding users... Done.");
  }
}
