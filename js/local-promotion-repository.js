import { STORAGE_CONFIG } from "./config.js";

class LocalPromotionRepository {
  constructor() { this.databasePromise = null; }
  open() {
    if (this.databasePromise) return this.databasePromise;
    this.databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(STORAGE_CONFIG.databaseName, STORAGE_CONFIG.databaseVersion);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(STORAGE_CONFIG.storeName)) {
          const store = database.createObjectStore(STORAGE_CONFIG.storeName, { keyPath: "id" });
          store.createIndex("active", "active", { unique: false });
          store.createIndex("startDate", "startDate", { unique: false });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("No se pudo abrir el almacenamiento local."));
    });
    return this.databasePromise;
  }
  async run(mode, action) {
    const database = await this.open();
    return new Promise((resolve, reject) => {
      const request = action(database.transaction(STORAGE_CONFIG.storeName, mode).objectStore(STORAGE_CONFIG.storeName));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("No se pudo completar la operación local."));
    });
  }
  getAll() { return this.run("readonly", (store) => store.getAll()); }
  getById(id) { return this.run("readonly", (store) => store.get(id)); }
  save(item) { return this.run("readwrite", (store) => store.put(item)); }
  delete(id) { return this.run("readwrite", (store) => store.delete(id)); }
  clear() { return this.run("readwrite", (store) => store.clear()); }
}
export const localPromotionRepository = new LocalPromotionRepository();
