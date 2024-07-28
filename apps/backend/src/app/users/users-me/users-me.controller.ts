import { Body, Controller, Delete, Get, Patch, Req } from "@nestjs/common";
import { UsersService } from "../users.service";
import { UpdateUserDto } from "../dtos/update-user.dto";

@Controller("users/me")
export class UsersMeController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  me(@Req() req: Request) {
    return this.usersService.findOneOrFail({
      where: {
        id: req["user"].id
      },
      relations: ["shares"]
    });
  }

  @Patch()
  async updateMe(@Req() req: Request, @Body() body: UpdateUserDto) {
    return this.usersService.update(req["user"].id, body);
  }

  @Delete()
  async deleteMe(@Req() req: Request) {
    return this.usersService.delete(req["user"].id);
  }
}
