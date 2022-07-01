import { Entity, Schema } from "redis-om";

export interface Post {
  body: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Post extends Entity {}

export const postSchema = new Schema(Post, {
  body: { type: "text" },
  userId: { type: "number" },
  createdAt: { type: "date", sortable: true },
  updatedAt: { type: "date", sortable: true },
});
