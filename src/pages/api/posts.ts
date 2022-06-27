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
import { Client, Repository } from "redis-om";
import * as next from "next";
import { getSession } from "next-auth/react";
import { StatusCodes } from "http-status-codes";

import { Post as PostModel, postSchema } from "src/models/posts";
import { PaginationQueryParamsDto } from "src/serializers/pagination.dto";
import { CreatePostBodyDto } from "src/serializers/posts.dto";

class PostHandler {
  redisClient: Client | undefined = undefined;
  postRepository: Repository<PostModel> | undefined;

  @Get()
  async findPosts(
    @Query(ValidationPipe) queryParams: PaginationQueryParamsDto
  ) {
    const postRepository = await this.getPostRepository();
    await postRepository.createIndex();
    const baseQuery = postRepository.search().return;

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

  private async getRedisClient() {
    if (!this.redisClient) {
      this.redisClient = new Client();
      this.redisClient = await this.redisClient.open(
        process.env.REDIS_STACK_URL
      );
    }
    return this.redisClient;
  }

  private async getPostRepository() {
    if (!this.postRepository) {
      const client = await this.getRedisClient();
      this.postRepository = client.fetchRepository(postSchema);

      await this.postRepository.dropIndex();
      await this.postRepository.createIndex();
    }
    return this.postRepository;
  }
}

export default createHandler(PostHandler);
