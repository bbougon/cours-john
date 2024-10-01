import {
  VideoPlayer,
  VideoPlayerRepository,
} from '../../../domaine/VideoPlayer.ts';
import { BookmarkRepository } from '../../../domaine/bookmark/Bookmark.ts';
import { MemoryStorage } from '../../../../test/domaine/memoryStorage.ts';
import { Repositories } from '../../../domaine/repository.ts';
import {
  GuitarClass,
  GuitarClassRepository,
} from '../../../domaine/class/classes.ts';
import { Artist, ArtistRepository } from '../../../domaine/class/Artist.ts';
import {
  aGuitarClassBuilder,
  anArtistBuilder,
} from '../../../../test/builders.ts';
import { fakerFR } from '@faker-js/faker';

export class MemoryVideoPlayerRepository implements VideoPlayerRepository {
  getByCriteria(_id: string, _smallScreen: boolean): Promise<VideoPlayer> {
    return Promise.resolve({
      embeddedVideo: `<img src="${fakerFR.image.url()}" width="600" height="480" />`,
    });
  }

  persist(_entity: VideoPlayer): void {
    throw new Error(
      'Persist method not implemented on MemoryVideoPlayerRepository'
    );
  }
}

class MemoryBookmarkRepository extends BookmarkRepository {
  public readonly memoryStorage: MemoryStorage;

  constructor() {
    const memoryStorage = new MemoryStorage();
    super(memoryStorage);
    this.memoryStorage = memoryStorage;
  }
}

class MemoryGuitarClassRepository implements GuitarClassRepository {
  private guitarClasses: Map<string, GuitarClass[]> = new Map();

  byPlaylist(playlistId: string): Promise<GuitarClass[]> {
    return Promise.resolve(this.guitarClasses.get(playlistId) || []);
  }

  persist(entity: GuitarClass): void {
    this.guitarClasses.set(entity.classId, [
      ...(this.guitarClasses.get(entity.classId) || []),
      entity,
    ]);
  }
}

class MemoryArtistRepository implements ArtistRepository {
  private artists: Artist[] = [];

  getAll(): Promise<Artist[]> {
    return Promise.resolve(this.artists);
  }

  persist(entity: Artist): void {
    this.artists.push(entity);
  }
}

export class MemoryRepositories implements Repositories {
  private readonly bookmarkRepository: BookmarkRepository =
    new MemoryBookmarkRepository();
  private readonly videoPlayerRepository: VideoPlayerRepository =
    new MemoryVideoPlayerRepository();
  private guitarClassRepository: GuitarClassRepository =
    new MemoryGuitarClassRepository();
  private artistRepository: ArtistRepository = new MemoryArtistRepository();

  constructor(
    configuration: { fakeData: boolean; useLocalStorage: boolean } = {
      fakeData: false,
      useLocalStorage: false,
    }
  ) {
    if (configuration.useLocalStorage) {
      this.bookmarkRepository = new BookmarkRepository(window.localStorage);
    }
    if (configuration.fakeData) {
      for (let i = 0; i < 30; i++) {
        const artist = anArtistBuilder().build();
        this.artistRepository.persist(artist);
        const max = fakerFR.number.int({ min: 2, max: 8 });
        for (let j = 0; j < max; j++) {
          const guitarClass = aGuitarClassBuilder()
            .withClassId(artist.id)
            .withNumberOfVideos(fakerFR.number.int({ min: 1, max: 5 }))
            .build();
          this.guitarClassRepository.persist(guitarClass);
        }
      }
    }
  }

  artists(): ArtistRepository {
    return this.artistRepository;
  }

  bookmarks(): BookmarkRepository {
    return this.bookmarkRepository;
  }

  guitarClass(): GuitarClassRepository {
    return this.guitarClassRepository;
  }

  videoPlayer(): VideoPlayerRepository {
    return this.videoPlayerRepository;
  }
}
