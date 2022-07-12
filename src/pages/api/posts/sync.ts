import { createHandler, Get } from "@storyofams/next-api-decorators";

import { PostController } from "./post.controller";

class PostSyncHandler extends PostController {
  @Get()
  async sync() {
    await this.getPostRepository();
    await this.syncCouchDB();
  }
}

export default createHandler(PostSyncHandler);
