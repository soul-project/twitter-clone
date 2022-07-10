import { createRxDatabase, RxDatabase } from "rxdb";
import { getRxStorageLoki } from "rxdb/plugins/lokijs";

export class BaseController {
  rxClient: RxDatabase | undefined = undefined;

  async getRxDbClient() {
    if (!this.rxClient) {
      this.rxClient = await createRxDatabase({
        name: "twitter-clone-db",
        storage: getRxStorageLoki(),
        ignoreDuplicate: true,
      });
    }
    return this.rxClient;
  }
}
