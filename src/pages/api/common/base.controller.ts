import { createRxDatabase, RxDatabase } from "rxdb";
import { addPouchPlugin, getRxStoragePouch } from "rxdb/plugins/pouchdb";

export class BaseController {
  rxClient: RxDatabase | undefined = undefined;

  async getRxDbClient() {
    if (!this.rxClient) {
      addPouchPlugin(require("pouchdb-adapter-memory"));

      this.rxClient = await createRxDatabase({
        name: process.env.DB_NAME!,
        storage: getRxStoragePouch("memory"),
        ignoreDuplicate: true,
      });
    }
    return this.rxClient;
  }
}
