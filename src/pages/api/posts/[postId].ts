import {
  createHandler,
  Delete,
  HttpException,
  Req,
} from "@storyofams/next-api-decorators";
import * as next from "next";
import { StatusCodes } from "http-status-codes";
import { getSession } from "next-auth/react";

import { getSyncedPostRepository } from "src/modules/api/utils";

class PostHandler {
  @Delete()
  async deletePost(@Req() req: next.NextApiRequest): Promise<void> {
    const {
      query: { postId },
    } = req;

    const session = await getSession({ req });

    const postRxRepository = await getSyncedPostRepository();
    const existingPostQuery = postRxRepository.findOne({
      selector: { entityId: postId },
    });
    const existingPost = await existingPostQuery.exec();

    if (!existingPost) throw new HttpException(StatusCodes.NOT_FOUND);

    if (existingPost.get("userId") !== session?.user.id)
      throw new HttpException(StatusCodes.FORBIDDEN);

    await existingPostQuery.remove();

    return;
  }
}

export default createHandler(PostHandler);
