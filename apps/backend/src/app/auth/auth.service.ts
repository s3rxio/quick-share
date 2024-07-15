import { CreateUserDto } from "@/user/dtos/create-user.dto";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "./dtos/login.dto";
import { UserService } from "@/user/user.service";
import { User } from "@/user/user.entity";
import { JwtService } from "@nestjs/jwt";

/* 
  TODO:
   - add hashing
   - add refresh tokens
*/
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async login(dto: LoginDto) {
    const user: User | null = await this.userService
      .findOneBy([
        {
          username: dto.login
        },
        {
          email: dto.login
        }
      ])
      .catch(() => null); // TODO: create findOneByOrFail

    if (!user || user.password !== dto.password) {
      throw new UnauthorizedException("Login or password is incorrect");
    }

    return {
      accessToken: await this.generateToken(user)
    };
  }

  async register(dto: CreateUserDto) {
    const user = await this.userService.create(dto);

    return {
      accessToken: await this.generateToken(user)
    };
  }

  private async generateToken(user: Pick<User, "id" | "username" | "email">) {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email
    };

    return this.jwtService.signAsync(payload);
  }
}