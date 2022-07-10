export type Post = {
  entityId: string;
  body: string;
  userId: number;
  createdAt: number;
  updatedAt: number;
};

export const postSchema = {
  title: "post schema",
  version: 0,
  primaryKey: "entityId", // TODO: Check if this will be auto appended anyway
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
