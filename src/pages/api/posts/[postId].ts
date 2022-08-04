import {
  createHandler,
  Delete,
  Get,
  HttpException,
  Req,
  Res,
} from "@storyofams/next-api-decorators";
import * as next from "next";
import { StatusCodes } from "http-status-codes";
import { unstable_getServerSession } from "next-auth";

import { getPostRepository } from "src/modules/api/utils";
import * as postModel from "src/models/posts";

import { authOptions } from "../auth/[...nextauth]";

class PostHandler {
  @Get()
  async getPost(@Req() req: next.NextApiRequest) {
    const {
      query: { postId },
    } = req;

    const postRxRepository = await getPostRepository();
    const existingPostQuery = postRxRepository.findOne({
      selector: { entityId: postId },
    });
    const existingPost = await existingPostQuery.exec();

    if (!existingPost) throw new HttpException(StatusCodes.NOT_FOUND);
    return existingPost.toJSON() as postModel.Post;
  }

  @Delete()
  async deletePost(
    @Req() req: next.NextApiRequest,
    @Res() res: next.NextApiResponse
  ): Promise<void> {
    const {
      query: { postId },
    } = req;

    const session = await unstable_getServerSession(req, res, authOptions);

    const postRxRepository = await getPostRepository();
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
