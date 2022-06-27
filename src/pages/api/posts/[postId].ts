import {
  createHandler,
  Delete,
  Get,
  HttpException,
  Req,
} from "@storyofams/next-api-decorators";
import * as next from "next";
import { Client } from "redis-om";
import { StatusCodes } from "http-status-codes";

import { postSchema } from "src/models/posts";

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
    await postRepository.remove(postId as string);
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
