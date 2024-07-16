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
import { ExceptionMessage } from "~/enums";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>
  ) {}

  findAll(options?: FindManyOptions<User>) {
    return this.repository.find({
      ...options,
      skip: options?.skip || 0,
      take: options?.take || 10
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
    await this.existOrFail(dto.username, dto.email);

    const user = this.repository.create(dto);

    return this.repository.save(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOneByIdOrFail(id);
    await this.existOrFail(dto.username, dto.email);

    return this.repository.update({ id }, dto);
  }

  async delete(id: string) {
    await this.findOneByIdOrFail(id);

    return this.repository.delete({ id });
  }

  async existOrFail(username: string, email: string) {
    const isExist = await this.repository.existsBy([{ username }, { email }]);

    if (isExist) {
      throw new ConflictException(ExceptionMessage.AlreadyExists);
    }

    return isExist;
  }
}
