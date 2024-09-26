import {BookmarkRepository} from "./bookmark/Bookmark.ts";

export interface Repository<T> {
  persist(entity: T): void;
}

export class Repositories {
  static bookmarks = (storage = window.localStorage): BookmarkRepository =>
    new BookmarkRepository(storage);
}