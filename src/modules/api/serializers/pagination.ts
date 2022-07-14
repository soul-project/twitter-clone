import { Type } from "class-transformer";
import { IsOptional, IsInt, Min, Max } from "class-validator";

export class PaginationQueryParamsDto {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 10;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  cursor = new Date().getTime();
}
