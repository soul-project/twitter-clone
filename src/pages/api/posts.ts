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
import { Client } from "redis-om";
import * as next from "next";
import { getSession } from "next-auth/react";
import { StatusCodes } from "http-status-codes";

import { postSchema } from "src/models/posts";
import { PaginationQueryParamsDto } from "src/serializers/pagination.dto";
import { CreatePostBodyDto } from "src/serializers/posts.dto";

class PostHandler {
  redisClient: Client | undefined = undefined;

  @Get()
  async findPosts(
    @Query(ValidationPipe) queryParams: PaginationQueryParamsDto
  ) {
    const client = await this.getRedisClient();
    const postRepository = client.fetchRepository(postSchema);
    const baseQuery = postRepository.search().return;

    return {
      posts: await baseQuery.page(
        queryParams.page - 1,
        queryParams.numItemsPerPage
      ),
      totalCount: await baseQuery.count(),
    };
  }

  @Post()
  async createPost(
    @Req() req: next.NextApiRequest,
    @Body(ValidationPipe) body: CreatePostBodyDto
  ) {
    const client = await this.getRedisClient();
    const postRepository = client.fetchRepository(postSchema);
    const session = await getSession({ req });

    if (session?.user.id !== body.userId)
      throw new HttpException(StatusCodes.FORBIDDEN);

    const newPost = await postRepository.createAndSave({
      title: body.title,
      userId: body.userId,
      body: body.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return newPost.toJSON();
  }

  private async getRedisClient() {
    if (!this.redisClient) {
      this.redisClient = new Client();
      this.redisClient = await this.redisClient.open(
        process.env.REDIS_STACK_URL
      );
    }
    return this.redisClient;
  }
}

export default createHandler(PostHandler);
