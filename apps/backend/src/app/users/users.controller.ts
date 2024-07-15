import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(":id")
  async findOneById(@Param("id", ParseUUIDPipe) id: string) {
    return this.userService.findOne({ id });
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
