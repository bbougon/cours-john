import { BookmarkRepository } from './bookmark/Bookmark.ts';
import { MemoryStorage } from '../../test/domaine/memoryStorage.ts';

export interface Repository<T> {
  persist(entity: T): void;
}

interface Repositories {
  bookmarks(): BookmarkRepository;
}

class MemoryBookmarkRepository extends BookmarkRepository {
  public readonly memoryStorage: MemoryStorage;

  constructor() {
    const memoryStorage = new MemoryStorage();
    super(memoryStorage);
    this.memoryStorage = memoryStorage;
  }
}

class MemoryRepositories implements Repositories {
  private readonly bookmarkRepository: BookmarkRepository =
    new MemoryBookmarkRepository();

  bookmarks(): BookmarkRepository {
    return this.bookmarkRepository;
  }
}

class JohnRepositories implements Repositories {
  private readonly bookmakRepository: BookmarkRepository = new BookmarkRepository(window.localStorage)
  bookmarks(): BookmarkRepository {
    return this.bookmakRepository
  }
}

export const repositories = () => {
  if (import.meta.env.DEV) {
    return new MemoryRepositories();
  }
  return new JohnRepositories();
};

