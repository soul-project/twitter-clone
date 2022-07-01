import axios from "axios";

export const create = async (values: CreateArgs) => {
  await axios.post("/api/posts", values, {
    headers: { "Content-Type": "application/json" },
  });
};

export type CreateArgs = {
  body: string;
};
