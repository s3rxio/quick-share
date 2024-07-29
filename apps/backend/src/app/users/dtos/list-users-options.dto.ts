import { IsArray, IsDateString, IsIn, IsOptional } from "class-validator";
import { User } from "../user.entity";
import { Transform } from "class-transformer";
import { IntersectionType } from "@nestjs/mapped-types";
import { UpdateUserDto } from "./update-user.dto";
import { PaginationOptionsDto } from "@backend/common/dtos";
import { Role } from "@backend/common/enums";
import { toArray } from "@backend/common/libs/transformFns";
import { SelectByString } from "@backend/common/types";

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
