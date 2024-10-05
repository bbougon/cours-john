import { StorageRepository } from '../storageRepository.ts';

export type Video = {
  title: string;
  id: string;
  image: string;
};

export type Bookmark = {
  className: string;
  video: Video;
};

export type GuitarClass = {
  title: string;
  videos: Video[];
};

class BookmarkMigration {
  constructor(private readonly storage: Storage) {
    
  }

  migrate(): void {
    const item = this.storage.getItem('john-storage');
    if(item) {
      const store = JSON.parse(item);
      const bookmarks = store['bookmarks'];
      let needToPersistStore = false
      bookmarks.forEach((bookmark: { [x: string]: unknown }) => {
        if (bookmark['classId']) {
          needToPersistStore = true
          delete bookmark['classId'];
        }
      });
      if(needToPersistStore) {
        this.storage.setItem('john-storage', JSON.stringify(store));
      }
    }
  }
}

export class BookmarkRepository extends StorageRepository<Bookmark> {
  constructor(storage: Storage) {
    super(storage);
    new BookmarkMigration(storage).migrate();
  }

  protected entityKey(): string {
    return 'bookmarks';
  }

  findByVideoId(id: string): Bookmark {
    return (this.fromStorage('bookmarks') as Bookmark[]).filter(
      (b) => b.video.id === id
    )[0];
  }

  toBePersisted(entity: Bookmark): { [key: string]: Bookmark | Bookmark[] } {
    return { bookmarks: [entity] };
  }
}
