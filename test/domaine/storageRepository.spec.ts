import { beforeEach, describe, expect, it } from 'vitest';
import { aBookmarkBuilder } from '../builders';
import { repositories } from '../../src/domaine/repository';
import { MemoryStorage } from './memoryStorage';
import { StorageRepository } from '../../src/domaine/storageRepository';
import {
  Bookmark,
  BookmarkRepository,
} from '../../src/domaine/bookmark/Bookmark';
import { fakerFR } from '@faker-js/faker';

describe('Storage repository', () => {
  let memoryStorage = new MemoryStorage();

  beforeEach(() => (memoryStorage = new MemoryStorage()));

  describe('For any entity', () => {
    it('Persists a single entity', () => {
      new SingleEntityRepository(memoryStorage).persist({ anEntity: 'entity' });

      const entity = new SingleEntityRepository(memoryStorage).get();

      expect(entity).toStrictEqual({ anEntity: 'entity' });
    });

    it('Persists an array of entity', () => {
      new ArrayEntityRepository(memoryStorage).persist({ entity: 'entity' });

      const entities = new ArrayEntityRepository(memoryStorage).getAll();

      expect(entities).toStrictEqual([{ entity: 'entity' }]);
    });

    it('Updates an array of entity', () => {
      new ArrayEntityRepository(memoryStorage).persist({ entity: 'entity1' });

      new ArrayEntityRepository(memoryStorage).persist({ entity: 'entity2' });
      const entities = new ArrayEntityRepository(memoryStorage).getAll();

      expect(entities).toStrictEqual([
        { entity: 'entity1' },
        { entity: 'entity2' },
      ]);
    });

    it('Only persists the entity array in the store', () => {
      memoryStorage.add(JSON.stringify({ obj: 'an object' }));

      new ArrayEntityRepository(memoryStorage).persist({ entity: 'entity1' });
      new ArrayEntityRepository(memoryStorage).persist({ entity: 'entity2' });

      expect(memoryStorage.entities).toStrictEqual(
        new Map([
          [
            'john-storage',
            JSON.stringify({
              obj: 'an object',
              'my-array-entity': [{ entity: 'entity1' }, { entity: 'entity2' }],
            }),
          ],
        ])
      );
    });

    it('Only persists the entity object in the store', () => {
      memoryStorage.add(JSON.stringify({ obj: 'an object' }));

      new SingleEntityRepository(memoryStorage).persist({
        anEntity: 'entity1',
      });
      new SingleEntityRepository(memoryStorage).persist({
        anEntity: 'entity2',
      });

      expect(memoryStorage.entities).toStrictEqual(
        new Map([
          [
            'john-storage',
            JSON.stringify({
              obj: 'an object',
              'my-entity': { anEntity: 'entity2' },
            }),
          ],
        ])
      );
    });

    it('Removes the entity object in the store', () => {
      memoryStorage.add(JSON.stringify({ obj: 'an object' }));
      new SingleEntityRepository(memoryStorage).persist({
        anEntity: 'entity2',
      });

      new SingleEntityRepository(memoryStorage).delete({
        anEntity: 'entity2',
      });

      expect(memoryStorage.entities).toStrictEqual(
        new Map([
          [
            'john-storage',
            JSON.stringify({
              obj: 'an object',
            }),
          ],
        ])
      );
    });

    it('Removes only the entity object from the array in the store', () => {
      memoryStorage.add(JSON.stringify({ obj: 'an object' }));
      new ArrayEntityRepository(memoryStorage).persist({
        entity: 'entity1',
      });
      new ArrayEntityRepository(memoryStorage).persist({
        entity: 'entity2',
      });

      new ArrayEntityRepository(memoryStorage).delete({
        entity: 'entity2',
      });

      expect(memoryStorage.entities).toStrictEqual(
        new Map([
          [
            'john-storage',
            JSON.stringify({
              obj: 'an object',
              'my-array-entity': [{ entity: 'entity1' }],
            }),
          ],
        ])
      );
    });
  });

  describe('For bookmarks', () => {
    it('Can store a bookmark', () => {
      const bookmark1 = aBookmarkBuilder().build();
      const bookmark2 = aBookmarkBuilder().build();
      const bookmark3 = aBookmarkBuilder().build();
      const bookmarkRepository = repositories().bookmarks();
      bookmarkRepository.persist(bookmark2);
      bookmarkRepository.persist(bookmark3);

      bookmarkRepository.persist(bookmark1);

      expect(
        bookmarkRepository.findByVideoId(bookmark1.video.id)
      ).toStrictEqual<Bookmark>(bookmark1);
    });

    it('Can migrate old bookmarks', () => {
      const memoryStorage = new MemoryStorage();
      const oldBookmarkRepository = new OldBookmarkRepository(memoryStorage);
      const firstSongName = fakerFR.music.songName();
      const firstBookmark = {
        classId: fakerFR.string.alpha(10),
        className: firstSongName,
        video: {
          id: fakerFR.string.alpha(10),
          image: fakerFR.image.url(),
          title: firstSongName,
        },
      };
      const secondSongName = fakerFR.music.songName();
      const secondBookmark = {
        classId: fakerFR.string.alpha(10),
        className: secondSongName,
        video: {
          id: fakerFR.string.alpha(10),
          image: fakerFR.image.url(),
          title: secondSongName,
        },
      };
      oldBookmarkRepository.persist(firstBookmark);
      oldBookmarkRepository.persist(secondBookmark);

      new BookmarkRepository(memoryStorage);

      expect(JSON.parse(memoryStorage.getItem('john-storage')!)).toStrictEqual({
        bookmarks: [
          {
            className: firstSongName,
            video: {
              id: expect.any(String),
              image: expect.any(String),
              title: firstSongName,
            },
          },
          {
            className: secondSongName,
            video: {
              id: expect.any(String),
              image: expect.any(String),
              title: secondSongName,
            },
          },
        ],
      });
    });

    it('Does not migrate if not necessary', () => {
      const memoryStorage = new MemoryStorage();
      const firstBookmark = aBookmarkBuilder().build();
      const secondBookmark = aBookmarkBuilder().build();
      memoryStorage.setItem(
        'john-storage',
        JSON.stringify({ bookmarks: [firstBookmark, secondBookmark] })
      );

      new BookmarkRepository(memoryStorage);

      expect(memoryStorage.migrationToHaveBeenCalled(1)).toBe(true);
    });
  });
});

type Video = {
  title: string;
  id: string;
  image: string;
};

type OldBookmark = {
  className: string;
  classId: string;
  video: Video;
};

class OldBookmarkRepository extends StorageRepository<OldBookmark> {
  toBePersisted(entity: OldBookmark): {
    [key: string]: OldBookmark | OldBookmark[];
  } {
    return { bookmarks: [entity] };
  }

  protected entityKey(): string {
    return 'bookmarks';
  }
}

type AnEntity = { anEntity: string };

class SingleEntityRepository extends StorageRepository<AnEntity> {
  constructor(memoryStorage: MemoryStorage) {
    super(memoryStorage);
  }

  protected entityKey(): string {
    return 'my-entity';
  }

  toBePersisted(entity: AnEntity): {
    [key: string]: AnEntity | AnEntity[];
  } {
    return { 'my-entity': entity };
  }

  get(): AnEntity {
    return this.fromStorage('my-entity') as AnEntity;
  }
}

type ArrayEntity = { entity: string };

class ArrayEntityRepository extends StorageRepository<ArrayEntity> {
  constructor(memoryStorage: MemoryStorage) {
    super(memoryStorage);
  }

  protected entityKey(): string {
    return 'my-array-entity';
  }

  toBePersisted(entity: ArrayEntity): {
    [key: string]: ArrayEntity | ArrayEntity[];
  } {
    return { 'my-array-entity': [entity] };
  }
}
