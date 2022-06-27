import {
  Body,
  createHandler,
  Get,
  HttpException,
  Post,
  Query,
  Req,
  ValidationPipe,
} from "@storyofams/next-api-decorators";
import * as next from "next";
import { getSession } from "next-auth/react";
import { StatusCodes } from "http-status-codes";

import { PaginationQueryParamsDto } from "src/serializers/pagination.dto";
import { CreatePostBodyDto } from "src/serializers/posts.dto";

import { PostController } from "./posts/post.controller";

class PostHandler extends PostController {
  @Get()
  async findPosts(
    @Query(ValidationPipe) queryParams: PaginationQueryParamsDto
  ) {
    const postRepository = await this.getPostRepository();
    await postRepository.createIndex();
    const baseQuery = postRepository
      .search()
      .sortBy("updatedAt", "DESC").return;

    const posts = await baseQuery.page(
      queryParams.page - 1,
      queryParams.numItemsPerPage
    );
    const totalCount = await baseQuery.count();

    return { posts, totalCount };
  }

  @Post()
  async createPost(
    @Req() req: next.NextApiRequest,
    @Body(ValidationPipe) body: CreatePostBodyDto
  ) {
    const postRepository = await this.getPostRepository();
    const session = await getSession({ req });

    if (!session?.user.id) throw new HttpException(StatusCodes.FORBIDDEN);

    const newPost = await postRepository.createAndSave({
      title: body.title,
      userId: session.user.id,
      body: body.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return newPost.toJSON();
  }
}

export default createHandler(PostHandler);
