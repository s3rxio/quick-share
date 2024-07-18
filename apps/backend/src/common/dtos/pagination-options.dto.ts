import { Transform } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";
import { toNumber } from "~/libs/transformFns";

export class PaginationOptionsDto {
  @Transform(toNumber)
  @IsNumber()
  @IsOptional()
  skip?: number = 0;

  @Transform(toNumber)
  @IsNumber()
  @IsOptional()
  take?: number = 10;
}
