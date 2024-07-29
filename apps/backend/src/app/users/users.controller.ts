import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { ListUsersOptionsDto } from "./dtos/list-users-options.dto";
import { Role } from "@backend/common/enums";
import { Roles } from "../roles/roles.decorator";

@Roles(Role.Admin)
@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findAll(@Query() options: ListUsersOptionsDto) {
    return this.userService.findAll(options);
  }

  @Roles(Role.User, Role.Admin)
  @Get(":id")
  async findOneById(@Param("id", ParseUUIDPipe) id: string) {
    return this.userService.findOneByIdOrFail(id);
  }

  @Roles(Role.User, Role.Admin)
  @Get(":id/shares")
  async findOneByIdWithShares(@Param("id", ParseUUIDPipe) id: string) {
    return this.userService.findOneOrFail({
      where: {
        id
      },
      relations: ["shares"]
    });
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Patch(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto
  ) {
    return this.userService.update(id, dto);
  }

  @Delete(":id")
  async delete(@Param("id", ParseUUIDPipe) id: string) {
    return this.userService.delete(id);
  }
}
