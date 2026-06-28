import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage-angular";

@Injectable({
  providedIn: "root"
})
export class StorageService {
  private _storage: Storage | null = null;
  private _initPromise: Promise<void>;

  constructor(private storage: Storage) {
    this._initPromise = this.init();
  }

  private async init(): Promise<void> {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  private async ready(): Promise<Storage> {
    await this._initPromise;
    if (!this._storage) {
      throw new Error("Storage no disponible");
    }
    return this._storage;
  }

  public async set(key: string, value: any): Promise<void> {
    const store = await this.ready();
    await store.set(key, value);
  }

  public async get(key: string): Promise<any> {
    const store = await this.ready();
    return store.get(key);
  }

  public async remove(key: string): Promise<void> {
    const store = await this.ready();
    await store.remove(key);
  }

  public async clear(): Promise<void> {
    const store = await this.ready();
    await store.clear();
  }
}
