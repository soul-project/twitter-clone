import {
  Body,
  createHandler,
  Get,
  HttpException,
  Post,
  Query,
  Req,
  ValidationPipe,
} from "@storyofams/next-api-decorators";
import * as next from "next";
import { getSession } from "next-auth/react";
import { StatusCodes } from "http-status-codes";
import { v4 as uuid } from "uuid";

import {
  CreatePostBodyDto,
  GetPostListQueryParamsDto,
} from "src/modules/api/serializers/posts";
import { getPostRepository } from "src/modules/api/utils";

class PostHandler {
  @Get()
  async findPosts(
    @Query(ValidationPipe)
    { limit, userId, cursor }: GetPostListQueryParamsDto
  ) {
    const postRxRepository = await getPostRepository();
    const results = await postRxRepository
      .find({
        limit,
        sort: [{ createdAt: "desc" }],
        selector: {
          ...(userId && { userId: userId }),
          createdAt: { $lt: cursor },
        },
      })
      .exec();

    const posts = results.map((doc) => doc.toJSON());
    return { posts };
  }

  @Post()
  async createPost(
    @Req() req: next.NextApiRequest,
    @Body(ValidationPipe) body: CreatePostBodyDto
  ) {
    const session = await getSession({ req });

    if (!session?.user.id) throw new HttpException(StatusCodes.FORBIDDEN);

    const postRxRepository = await getPostRepository();

    const newPost = await postRxRepository.insert({
      entityId: uuid(),
      userId: session.user.id,
      body: body.body,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    });

    return newPost!.toJSON();
  }
}

export default createHandler(PostHandler);
