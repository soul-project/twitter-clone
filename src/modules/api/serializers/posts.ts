import { Type } from "class-transformer";
import { IsInt, IsOptional, MaxLength, MinLength } from "class-validator";

import { PaginationQueryParamsDto } from "./pagination";

export class CreatePostBodyDto {
  @MaxLength(255)
  @MinLength(1)
  body!: string;
}

export class GetPostListQueryParamsDto extends PaginationQueryParamsDto {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  userId?: number;
}
