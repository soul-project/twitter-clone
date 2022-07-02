import axios from "axios";

export const NUM_ITEMS_PER_PAGE = 10;

export const getList = async (args: getListArgs = {}): Promise<PostList> => {
  const { data } = await axios.get<PostListData>("/api/posts", {
    params: { ...args, numItemsPerPage: NUM_ITEMS_PER_PAGE },
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
  createdAt: string;
  updatedAt: string;
};

type PostListData = {
  posts: PostData[];
  totalCount: number;
};

export type Post = {
  entityId: string;
  userId: number;
  body: string;
  createdAt: Date;
  updatedAt: Date;
};

type PostList = {
  posts: Post[];
  totalCount: number;
};

type getListArgs = {
  page?: number;
  userId?: number;
};
