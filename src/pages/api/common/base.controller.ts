import { Client } from "redis-om";
import { createRxDatabase, RxDatabase } from "rxdb";
import { getRxStorageLoki } from "rxdb/plugins/lokijs";

export class BaseController {
  redisClient: Client | undefined = undefined;
  rxClient: RxDatabase | undefined = undefined;

  async getRedisClient() {
    if (!this.redisClient) {
      this.redisClient = new Client();
      this.redisClient = await this.redisClient.open(
        process.env.REDIS_STACK_URL
      );
    }
    return this.redisClient;
  }

  async getRxDbClient() {
    if (!this.rxClient) {
      this.rxClient = await createRxDatabase({
        name: "twitter-clone-db",
        storage: getRxStorageLoki(),
        ignoreDuplicate: true,
      });
    }
    return this.rxClient;
  }
}
