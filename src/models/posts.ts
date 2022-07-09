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

export const postRxSchema = {
  title: "post schema",
  version: 0,
  primaryKey: "entityId",
  type: "object",
  properties: {
    entityId: {
      type: "string",
      maxLength: 100,
    },
    body: {
      type: "string",
      maxLength: 500,
    },
    userId: {
      type: "integer",
    },
    createdAt: {
      type: "integer",
    },
    updatedAt: {
      type: "integer",
    },
  },
  required: ["entityId", "body", "userId", "createdAt", "updatedAt"],
  indexes: ["createdAt", "updatedAt"],
};
