import { RxCollection, RxCouchDBReplicationState } from "rxdb";
import { addRxPlugin, createRxDatabase, RxDatabase } from "rxdb";
import { addPouchPlugin, getRxStoragePouch } from "rxdb/plugins/pouchdb";
import { RxDBReplicationCouchDBPlugin } from "rxdb/plugins/replication-couchdb";
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election";

import { Post, postSchema } from "src/models/posts";

let postRepository: RxCollection<Post> | undefined = undefined;
let rxClient: RxDatabase | undefined = undefined;
let postReplicationState: RxCouchDBReplicationState | undefined = undefined;

export async function getRxDbClient() {
  if (!rxClient) {
    addPouchPlugin(require("pouchdb-adapter-memory"));
    addPouchPlugin(require("pouchdb-adapter-http"));
    addRxPlugin(RxDBReplicationCouchDBPlugin);
    addRxPlugin(RxDBLeaderElectionPlugin);

    rxClient = await createRxDatabase({
      name: process.env.DB_NAME!,
      storage: getRxStoragePouch("memory"),
      ignoreDuplicate: true,
    });
  }
  return rxClient;
}

export async function getPostRepository(): Promise<RxCollection<Post>> {
  const client = await getRxDbClient();
  if (postRepository === undefined) {
    const collection = await client.addCollections({
      posts: { schema: postSchema },
    });
    postRepository = collection.posts;
  }
  return postRepository!;
}

export async function getSyncedPostRepository(): Promise<RxCollection<Post>> {
  await getPostRepository();
  await syncCouchDBForPostRepository();
  return postRepository!;
}

export async function syncCouchDBForPostRepository(args?: {
  limit?: number;
  cursor?: number;
  userId?: number;
}) {
  if (
    !process.env.COUCH_DB_USERNAME ||
    !process.env.COUCH_DB_PASSWORD ||
    !process.env.COUCH_DB_HOST ||
    !process.env.COUCH_DB_PORT
  ) {
    return;
  }

  if (postReplicationState) return postReplicationState;

  postReplicationState = postRepository!.syncCouchDB({
    remote:
      `http://${process.env.COUCH_DB_USERNAME}:${process.env.COUCH_DB_PASSWORD}` +
      `@${process.env.COUCH_DB_HOST}:${process.env.COUCH_DB_PORT}/${process.env.DB_NAME}/`,
    waitForLeadership: true,
    direction: {
      pull: true,
      push: true,
    },
    options: {
      live: true,
      retry: true,
      batches_limit: 10,
    },
    query: postRepository!.find({
      limit: args?.limit || 10,
      sort: [{ updatedAt: "desc" }],
      selector: {
        ...(args?.userId && { userId: args.userId }),
        ...(args?.cursor && {
          createdAt: {
            $lt: args.cursor,
          },
        }),
      },
    }),
  });
  return postReplicationState;
}
