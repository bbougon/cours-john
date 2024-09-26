import { Repository } from './repository.ts';
import deepEqual from 'deep-equal';

export abstract class StorageRepository<T> implements Repository<T> {
  constructor(protected readonly storage: Storage) {}

  persist(entity: T): void {
    const item = this.storage.getItem('john-storage');
    if (item) {
      const store = JSON.parse(item);
      const element = store[this.entityKey()];
      store[this.entityKey()] = this.toBePersisted(entity)[this.entityKey()];
      if (Array.isArray(element)) {
        store[this.entityKey()] = [...element, entity];
      }
      this.storage.setItem('john-storage', JSON.stringify(store));
    } else {
      this.storage.setItem(
        'john-storage',
        JSON.stringify(this.toBePersisted(entity))
      );
    }
  }

  delete(entity: T): void {
    const item = this.storage.getItem('john-storage');
    if (item) {
      const store = JSON.parse(item);
      const element = store[this.entityKey()];
      if (Array.isArray(element)) {
        store[this.entityKey()] = element.filter((e) => !deepEqual(e, entity));
      } else {
        delete store[this.entityKey()];
      }
      this.storage.setItem('john-storage', JSON.stringify(store));
    }
  }

  getAll(): T[] {
    return this.fromStorage(this.entityKey()) as T[];
  }

  protected fromStorage(keyName: string): T | T[] {
    const item = this.storage.getItem('john-storage');
    if (item) {
      return JSON.parse(item)[keyName];
    }
    return [];
  }

  abstract toBePersisted(entity: T): { [key: string]: T | T[] };

  protected abstract entityKey(): string;
}
