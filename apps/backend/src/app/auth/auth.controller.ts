import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "@/users/dtos/create-user.dto";
import { LoginDto } from "./dtos/login.dto";
import { Public } from "~/decoratos";

@Public()
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post("register")
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }
}
