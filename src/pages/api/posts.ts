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
import getUrls from "get-urls";
import parser from "html-metadata-parser";
import pino from "pino";

import {
  CreatePostBodyDto,
  GetPostListQueryParamsDto,
} from "src/modules/api/serializers/posts";
import { getPostRepository } from "src/modules/api/utils";
import * as postModel from "src/models/posts";

class PostHandler {
  logger = pino({ name: PostHandler.name });

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

    const posts = await Promise.all(
      results.map(async (doc) => {
        const document = doc.toJSON() as postModel.Post;
        const extractedUrls = getUrls(document.body);
        try {
          if (extractedUrls.size > 0) {
            const chosenPreviewUrl =
              Array.from(extractedUrls)[extractedUrls.size - 1];
            const { meta } = await parser(chosenPreviewUrl);
            return {
              ...doc.toJSON(),
              previewMetadata: {
                title: meta.title,
                description: meta.description,
                image: meta.image,
                url: chosenPreviewUrl,
              },
            };
          }
        } catch (err) {
          this.logger.error(err);
        }
        return document;
      })
    );
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
