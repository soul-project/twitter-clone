import { Type } from "class-transformer";
import { IsInt, MaxLength, MinLength } from "class-validator";

export class CreatePostBodyDto {
  @MaxLength(255)
  @MinLength(1)
  title!: string;

  @MaxLength(255)
  @MinLength(1)
  body!: string;

  @Type(() => Number)
  @IsInt()
  userId!: number;
}
