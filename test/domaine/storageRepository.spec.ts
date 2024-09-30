import { beforeEach, describe, expect, it } from 'vitest';
import { aBookmarkBuilder } from '../builders';
import {
  repositories,
} from '../../src/domaine/repository';
import { MemoryStorage } from './memoryStorage';
import { StorageRepository } from '../../src/domaine/storageRepository';
import { Bookmark } from '../../src/domaine/bookmark/Bookmark';

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
  });
});

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
