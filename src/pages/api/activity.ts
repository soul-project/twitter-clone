import { createHandler, Post, Req } from "@storyofams/next-api-decorators";
import * as next from "next";
import pino from "pino";

class ActivityHandler {
  logger = pino({ name: ActivityHandler.name });

  @Post()
  async postActivity(@Req() req: next.NextApiRequest) {
    const { body } = req;
    this.logger.info(body);
    return;
  }
}

export default createHandler(ActivityHandler);
