import { RxCollection, RxDocument, RxQuery } from "rxdb";

import { Post, postSchema } from "src/models/posts";

import BaseController from "./baseController";

export default class PostController extends BaseController {
  postRepository: RxCollection<Post> | undefined = undefined;

  async getPostRepository(): Promise<RxCollection<Post>> {
    const client = await this.getRxDbClient();
    if (!client.collections.posts) {
      const collection = await client.addCollections({
        posts: { schema: postSchema },
      });
      this.postRepository = collection.posts;
    }
    return this.postRepository!;
  }

  async syncCouchDB(args?: {
    limit?: number;
    cursor?: number;
    userId?: number;
  }) {
    console.log("called");
    if (
      !process.env.COUCH_DB_USERNAME ||
      !process.env.COUCH_DB_PASSWORD ||
      !process.env.COUCH_DB_HOST ||
      !process.env.COUCH_DB_PORT
    ) {
      return;
    }

    try {
      const postRepository = await this.getPostRepository();
      return postRepository.syncCouchDB({
        remote:
          `http://${process.env.COUCH_DB_USERNAME}:${process.env.COUCH_DB_PASSWORD}` +
          `@${process.env.COUCH_DB_HOST}:${process.env.COUCH_DB_PORT}/${process.env.DB_NAME}/`,
        waitForLeadership: true,
        direction: {
          pull: true,
          push: true,
        },
        options: {
          live: false,
          retry: true,
          batch_size: 1, // only transfer one document per batch
          batches_limit: 1, // only one batch in parallel
        },
        query: postRepository.find({
          limit: args?.limit || 10,
          sort: [{ updatedAt: "desc" }],
          selector: {
            ...(args?.userId && { userId: args.userId }),
            ...(args?.cursor && {
              createdAt: {
                $lt: args.cursor,
              },
            }),
          },
        }),
      });
    } catch (_err) {
      return null;
    }
  }

  async pushChangesToCouchDB() {
    if (
      !process.env.COUCH_DB_USERNAME ||
      !process.env.COUCH_DB_PASSWORD ||
      !process.env.COUCH_DB_HOST ||
      !process.env.COUCH_DB_PORT
    ) {
      return;
    }
    try {
      return (await this.getPostRepository()).syncCouchDB({
        remote:
          `http://${process.env.COUCH_DB_USERNAME}:${process.env.COUCH_DB_PASSWORD}` +
          `@${process.env.COUCH_DB_HOST}:${process.env.COUCH_DB_PORT}/${process.env.DB_NAME}/`,
        waitForLeadership: true,
        direction: {
          pull: false,
          push: true,
        },
        options: {
          live: false,
          retry: true,
        },
      });
    } catch (_err) {
      return null;
    }
  }
}
