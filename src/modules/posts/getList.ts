import axios from "axios";

export const getList = async (): Promise<PostList> => {
  const { data } = await axios.get<PostListData>("/api/posts");
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
