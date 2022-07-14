import { addRxPlugin, createRxDatabase, RxDatabase } from "rxdb";
import { addPouchPlugin, getRxStoragePouch } from "rxdb/plugins/pouchdb";
import { RxDBReplicationCouchDBPlugin } from "rxdb/plugins/replication-couchdb";
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election";

export default class BaseController {
  rxClient: RxDatabase | undefined = undefined;

  async getRxDbClient() {
    if (!this.rxClient) {
      addPouchPlugin(require("pouchdb-adapter-memory"));
      addPouchPlugin(require("pouchdb-adapter-http"));
      addRxPlugin(RxDBReplicationCouchDBPlugin);
      addRxPlugin(RxDBLeaderElectionPlugin);

      this.rxClient = await createRxDatabase({
        name: process.env.DB_NAME!,
        storage: getRxStoragePouch("memory"),
        ignoreDuplicate: true,
      });
    }
    return this.rxClient;
  }
}
