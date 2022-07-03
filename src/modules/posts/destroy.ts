import axios from "axios";

export const destroy = async ({ postId }: DestroyArgs) => {
  await axios.delete(`/api/posts/${postId}`, {
    headers: { "Content-Type": "application/json" },
  });
};

type DestroyArgs = {
  postId: string;
};
