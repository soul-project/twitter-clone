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
} from "src/serializers/posts.dto";

import { PostController } from "./posts/post.controller";

class PostHandler extends PostController {
  @Get()
  async findPosts(
    @Query(ValidationPipe)
    { page, userId, numItemsPerPage }: GetPostListQueryParamsDto
  ) {
    const postRxRepository = await this.getPostRepository();
    const results = await postRxRepository
      .find({
        limit: numItemsPerPage,
        skip: numItemsPerPage * (page - 1),
        sort: [{ updatedAt: "desc" }],
        selector: {
          ...(userId && { userId: userId }),
        },
      })
      .exec();

    // TODO: Optimize counting in the future
    const totalCount = (await postRxRepository.find().exec()).length;
    const posts = results.map((doc) => doc.toJSON());

    return { posts: posts, totalCount };
  }

  @Post()
  async createPost(
    @Req() req: next.NextApiRequest,
    @Body(ValidationPipe) body: CreatePostBodyDto
  ) {
    const session = await getSession({ req });

    if (!session?.user.id) throw new HttpException(StatusCodes.FORBIDDEN);

    const postRxRepository = await this.getPostRepository();

    const newPost = await postRxRepository.insert({
      entityId: uuid(),
      userId: session.user.id,
      body: body.body,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    });

    await this.syncCouchDB();

    return newPost!.toJSON();
  }
}

export default createHandler(PostHandler);
