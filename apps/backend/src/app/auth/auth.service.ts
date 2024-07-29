import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "./dtos/login.dto";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "../users/dtos/create-user.dto";
import { User } from "../users/user.entity";
import { UsersService } from "../users/users.service";

/* 
  TODO:
   - add refresh tokens
*/
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findOne({
      where: [
        {
          username: dto.login
        },
        {
          email: dto.login
        }
      ]
    });

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!user || !isMatch) {
      throw new UnauthorizedException("Login or password is incorrect");
    }

    return {
      accessToken: await this.generateToken(user)
    };
  }

  async register(dto: CreateUserDto) {
    const hash = await this.usersService.generateHash(dto.password);

    const user = await this.usersService.create({
      ...dto,
      password: hash
    });

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
