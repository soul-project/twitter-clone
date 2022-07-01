import { MaxLength, MinLength } from "class-validator";

export class CreatePostBodyDto {
  @MaxLength(255)
  @MinLength(1)
  body!: string;
}
