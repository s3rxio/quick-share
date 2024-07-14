import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Where } from "~/types";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { ExceptionMessages } from "~/exception-messages";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>
  ) {}

  findAll(where?: Where<User>) {
    return this.repository.find({
      where
    });
  }

  async findOne(where: Where<User>) {
    const user = await this.repository.findOne({
      where
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async findOneById(id: string) {
    return this.findOne({
      id
    });
  }

  async create(dto: CreateUserDto) {
    await this.existOrFail(dto.username, dto.email);

    return this.repository.save(dto);
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOneById(id);
    await this.existOrFail(dto.username, dto.email);

    return this.repository.update({ id }, dto);
  }

  async delete(id: string) {
    await this.findOneById(id);

    return this.repository.delete({ id });
  }

  async existOrFail(username: string, email: string) {
    const isExist = await this.repository.existsBy([{ username }, { email }]);

    if (isExist) {
      throw new ConflictException(ExceptionMessages.AlreadyExists);
    }

    return isExist;
  }
}
