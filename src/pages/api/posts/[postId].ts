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
import { Client, Repository } from "redis-om";
import { StatusCodes } from "http-status-codes";
import { getSession } from "next-auth/react";

import { postSchema, Post as PostModel } from "src/models/posts";
import { CreatePostBodyDto } from "src/serializers/posts.dto";

class PostHandler {
  redisClient: Client | undefined = undefined;
  postRepository: Repository<PostModel> | undefined;

  @Get()
  async findPost(@Req() { query: { postId } }: next.NextApiRequest) {
    const client = await this.getRedisClient();
    const postRepository = client.fetchRepository(postSchema);
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

    if (existingPost.userId === null) {
      throw new HttpException(StatusCodes.NOT_FOUND);
    }
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
    existingPost.title = body.title;

    await postRepository.save(existingPost);
    return existingPost;
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
      this.postRepository.createIndex();
    }
    return this.postRepository;
  }
}

export default createHandler(PostHandler);
