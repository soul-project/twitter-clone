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
      // if (process.env.NODE_ENV !== "production") {
      //   await import("rxdb/plugins/dev-mode").then((module) =>
      //     addRxPlugin(module as any)
      //   );
      // }
      this.rxClient = await createRxDatabase({
        name: "twitter-clone-db",
        storage: getRxStorageLoki(),
      });
    }
    return this.rxClient;
  }
}
