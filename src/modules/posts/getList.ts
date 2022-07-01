import axios from "axios";

export const getList = async () => {
  const { data } = await axios.get<PostList>("/api/posts");
  return data;
};

export type Post = {
  entityId: string;
  userId: number;
  body: string;
};

type PostList = {
  posts: Post[];
  totalCount: number;
};
