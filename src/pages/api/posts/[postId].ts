import {
  Body,
  createHandler,
  Delete,
  Get,
  HttpException,
  Put,
  Req,
  ValidationPipe,
} from "@storyofams/next-api-decorators";
import * as next from "next";
import { StatusCodes } from "http-status-codes";
import { getSession } from "next-auth/react";

import { CreatePostBodyDto } from "src/serializers/posts.dto";

import { PostController } from "./post.controller";

class PostHandler extends PostController {
  @Get()
  async findPost(@Req() { query: { postId } }: next.NextApiRequest) {
    const postRepository = await this.getPostRepository();
    const result = await postRepository.fetch(postId as string);

    if (result.userId === null) {
      throw new HttpException(StatusCodes.NOT_FOUND);
    }

    return result;
  }

  @Delete()
  async deletePost(@Req() req: next.NextApiRequest) {
    const {
      query: { postId },
    } = req;
    const postRepository = await this.getPostRepository();
    const existingPost = await postRepository.fetch(postId as string);
    const session = await getSession({ req });

    if (existingPost.userId === null)
      throw new HttpException(StatusCodes.NOT_FOUND);

    if (session?.user.id !== existingPost.userId)
      throw new HttpException(StatusCodes.FORBIDDEN);

    await postRepository.remove(postId as string);
  }

  @Put()
  async updatePost(
    @Req() req: next.NextApiRequest,
    @Body(ValidationPipe) body: CreatePostBodyDto
  ) {
    const {
      query: { postId },
    } = req;
    const postRepository = await this.getPostRepository();
    const existingPost = await postRepository.fetch(postId as string);
    const session = await getSession({ req });

    if (session?.user.id !== existingPost.userId)
      throw new HttpException(StatusCodes.FORBIDDEN);

    existingPost.body = body.body;

    await postRepository.save(existingPost);
    return existingPost;
  }
}

export default createHandler(PostHandler);
