import { IsNotEmpty, IsString, Length } from "class-validator";

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @Length(6, 32)
  @IsString()
  password: string;
}
