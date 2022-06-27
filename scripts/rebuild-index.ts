import { Client } from "redis-om";
import { config } from "dotenv";
import fs from "fs";

import { postSchema } from "../src/models/posts";

const LOCAL_ENV_PATH = "./.env.development.local";
const ENV_PATH = "./.env.development";

if (fs.existsSync(LOCAL_ENV_PATH)) {
  config({ path: LOCAL_ENV_PATH });
} else {
  config({ path: ENV_PATH });
}

const redisClient = new Client();

async function rebuildIndexes() {
  const client = await redisClient.open(process.env.REDIS_STACK_URL);

  const postRepository = client.fetchRepository(postSchema);

  console.log(`Rebuilding indexes for ${process.env.REDIS_STACK_URL} ...`);
  try {
    await postRepository.createIndex();
  } catch (err) {
    console.error(err);
  }
  await client.close();

  console.log("Done.");
}

rebuildIndexes();
