import axios from "axios";

export const NUM_ITEMS_PER_PAGE = 10;

export const getList = async (args: getListArgs = {}): Promise<PostList> => {
  const { data } = await axios.get<PostListData>("/api/posts", {
    params: { ...args, limit: NUM_ITEMS_PER_PAGE },
  });
  return {
    ...data,
    posts: data.posts.map((post) => ({
      ...post,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
    })),
  };
};

getList.key = "modules/posts/getList";

type PostData = {
  entityId: string;
  userId: number;
  body: string;
  createdAt: number;
  updatedAt: number;
  previewMetadata?: {
    title: string;
    description?: string;
    image?: string;
    url: string;
  };
};

type PostListData = {
  posts: PostData[];
};

export type Post = {
  entityId: string;
  userId: number;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  previewMetadata?: {
    title: string;
    description?: string;
    image?: string;
    url: string;
  };
};

type PostList = {
  posts: Post[];
};

type getListArgs = {
  cursor?: number;
  userId?: number;
};
