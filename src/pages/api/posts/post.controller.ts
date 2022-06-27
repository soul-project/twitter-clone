import { Repository } from "redis-om";

import { Post, postSchema } from "src/models/posts";

import { BaseController } from "../common/base.controller";

export class PostController extends BaseController {
  postRepository: Repository<Post> | undefined;

  async getPostRepository() {
    if (!this.postRepository) {
      const client = await this.getRedisClient();
      this.postRepository = client.fetchRepository(postSchema);

      await this.postRepository.dropIndex();
      await this.postRepository.createIndex();
    }
    return this.postRepository;
  }
}
