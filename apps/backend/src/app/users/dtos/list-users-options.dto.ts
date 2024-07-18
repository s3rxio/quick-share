import { IsArray, IsDateString, IsIn, IsOptional } from "class-validator";
import { PaginationOptionsDto } from "~/dtos";
import { SelectByString } from "~/types";
import { User } from "../user.entity";
import { Transform } from "class-transformer";
import { toArray } from "~/libs/transformFns";
import { IntersectionType } from "@nestjs/mapped-types";
import { UpdateUserDto } from "./update-user.dto";
import { Role } from "~/enums";

const userKeys: SelectByString<User>[] = [
  "id",
  "username",
  "email",
  "roles",
  "createdAt",
  "updatedAt"
];

export class ListUsersOptionsDto extends IntersectionType(
  UpdateUserDto,
  PaginationOptionsDto
) {
  @Transform(toArray)
  @IsArray()
  @IsIn(userKeys, { each: true })
  @IsOptional()
  select?: SelectByString<User>[];

  @Transform(toArray)
  @IsArray()
  @IsIn(Object.values(Role), { each: true })
  @IsOptional()
  roles?: Role[];

  @IsIn(["asc", "desc"])
  @IsOptional()
  order: "asc" | "desc" = "asc";

  @IsIn(userKeys)
  @IsOptional()
  orderBy?: SelectByString<User> = "username";

  @IsDateString()
  @IsOptional()
  createdAt?: Date;
}
