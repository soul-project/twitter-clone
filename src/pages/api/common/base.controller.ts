import { Client } from "redis-om";

export class BaseController {
  redisClient: Client | undefined = undefined;

  async getRedisClient() {
    if (!this.redisClient) {
      this.redisClient = new Client();
      this.redisClient = await this.redisClient.open(
        process.env.REDIS_STACK_URL
      );
    }
    return this.redisClient;
  }
}
