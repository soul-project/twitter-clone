import {
  Body,
  createHandler,
  Delete,
  Get,
  HttpException,
  Put,
  Req,
  Res,
  ValidationPipe,
} from "@storyofams/next-api-decorators";
import * as next from "next";
import { Client } from "redis-om";
import { StatusCodes } from "http-status-codes";
import { getSession } from "next-auth/react";

import { postSchema } from "src/models/posts";
import { CreatePostBodyDto } from "src/serializers/posts.dto";

class PostHandler {
  redisClient: Client | undefined = undefined;

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
  async deletePost(@Req() { query: { postId } }: next.NextApiRequest) {
    const client = await this.getRedisClient();
    const postRepository = client.fetchRepository(postSchema);
    // TODO: Validate to see if current user owns this post
    await postRepository.remove(postId as string);
  }

  @Put()
  async updatePost(
    @Req() req: next.NextApiRequest,
    @Res() res: next.NextApiResponse,
    @Body(ValidationPipe) body: CreatePostBodyDto
  ) {
    const {
      query: { postId },
    } = req;
    const client = await this.getRedisClient();
    const postRepository = client.fetchRepository(postSchema);
    const existingPost = await postRepository.fetch(postId as string);
    const session = await getSession({ req });

    console.log(
      "🚀 ~ file: [postId].ts ~ line 53 ~ PostHandler ~ session",
      session
    );

    // TODO: Validate if current user owns this post

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
}

export default createHandler(PostHandler);
