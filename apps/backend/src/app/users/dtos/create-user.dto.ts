import { Exclude } from "class-transformer";
import {
  IsArray,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length
} from "class-validator";
import { Role } from "~/enums";

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

  @IsArray()
  @IsIn(Object.values(Role), { each: true })
  @IsOptional()
  roles?: Role[];
}
