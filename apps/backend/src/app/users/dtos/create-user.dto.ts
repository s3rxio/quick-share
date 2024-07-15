import { Exclude } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @Exclude({
    toPlainOnly: true
  })
  @IsString()
  @Length(6, 32)
  password: string;

  @IsEmail()
  email: string;
}
