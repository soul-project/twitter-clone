import { RxCollection, RxDocument, RxQuery } from "rxdb";

import { Post, postSchema } from "src/models/posts";

import { BaseController } from "../common/base.controller";

export class PostController extends BaseController {
  postRepository: RxCollection<Post> | undefined = undefined;

  async getPostRepository(): Promise<RxCollection<Post>> {
    const client = await this.getRxDbClient();
    if (!client.collections.posts) {
      const collection = await client.addCollections({
        posts: { schema: postSchema },
      });
      this.postRepository = collection.posts;
      await this.syncCouchDB();
    }
    return this.postRepository!;
  }

  async syncCouchDB(query?: RxQuery<Post, any>) {
    if (
      !process.env.COUCH_DB_USERNAME ||
      !process.env.COUCH_DB_PASSWORD ||
      !process.env.COUCH_DB_HOST ||
      !process.env.COUCH_DB_PORT
    ) {
      return;
    }

    try {
      (await this.getPostRepository()).syncCouchDB({
        remote:
          `http://${process.env.COUCH_DB_USERNAME}:${process.env.COUCH_DB_PASSWORD}` +
          `@${process.env.COUCH_DB_HOST}:${process.env.COUCH_DB_PORT}/${process.env.DB_NAME}/`,
        waitForLeadership: true,
        direction: {
          pull: true,
          push: true,
        },
        options: {
          live: true,
          retry: true,
        },
        query,
      });
    } catch (_err) {}
  }
}
