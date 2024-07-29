import { Body, Controller, Delete, Get, Patch } from "@nestjs/common";
import { UsersService } from "../users.service";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { User } from "../user.decorator";

@Controller("users/me")
export class UsersMeController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  me(@User("id") id: string) {
    return this.usersService.findOneOrFail({
      where: {
        id: id
      },
      relations: ["shares"]
    });
  }

  @Patch()
  async updateMe(@User("id") id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }

  @Delete()
  async deleteMe(@User("id") id: string) {
    return this.usersService.delete(id);
  }
}
