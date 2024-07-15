import { CreateUserDto } from "@/users/dtos/create-user.dto";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "./dtos/login.dto";
import { UsersService } from "@/users/users.service";
import { User } from "@/users/user.entity";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

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
    const user: User | null = await this.usersService
      .findOneBy([
        {
          username: dto.login
        },
        {
          email: dto.login
        }
      ])
      .catch(() => null); // TODO: create findOneByOrFail

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!user || !isMatch) {
      throw new UnauthorizedException("Login or password is incorrect");
    }

    return {
      accessToken: await this.generateToken(user)
    };
  }

  async register(dto: CreateUserDto) {
    const hash = await bcrypt.hash(
      dto.password,
      process.env.BCRYPT_SALT_ROUNDS
    );

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
