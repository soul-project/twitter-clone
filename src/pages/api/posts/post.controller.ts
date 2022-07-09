import { Repository } from "redis-om";
import { RxCollection } from "rxdb";
import { v4 as uuidv4 } from "uuid";

import { Post, postRxSchema, postSchema } from "src/models/posts";

import { BaseController } from "../common/base.controller";

export class PostController extends BaseController {
  postRepository: Repository<Post> | undefined;
  postRxRepository: RxCollection | undefined;

  async getPostRepository() {
    if (!this.postRepository) {
      const client = await this.getRedisClient();
      this.postRepository = client.fetchRepository(postSchema);
    }
    return this.postRepository;
  }

  async getRxPostRepository() {
    const client = await this.getRxDbClient();
    if (!client.collections.posts) {
      await client.addCollections({ posts: { schema: postRxSchema } });
      this.postRxRepository = client.collections.posts;
    }
    return this.postRxRepository;
  }
}
