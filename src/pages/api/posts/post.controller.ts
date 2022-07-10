import { RxCollection } from "rxdb";

import { Post, postSchema } from "src/models/posts";

import { BaseController } from "../common/base.controller";

export class PostController extends BaseController {
  postRepository: RxCollection<Post> | undefined;

  async getPostRepository() {
    const client = await this.getRxDbClient();
    if (!client.collections.posts) {
      await client.addCollections({ posts: { schema: postSchema } });
      this.postRepository = client.collections.posts;
    }
    return this.postRepository;
  }
}
