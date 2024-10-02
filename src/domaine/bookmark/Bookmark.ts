import { StorageRepository } from '../storageRepository.ts';

export type Video = {
  title: string;
  id: string;
  image: string;
};

export type Bookmark = {
  className: string;
  classId: string;
  video: Video;
};

export type GuitarClass = {
  title: string;
  classId: string;
  videos: Video[];
};

export class BookmarkRepository extends StorageRepository<Bookmark> {
  constructor(storage: Storage) {
    super(storage);
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
