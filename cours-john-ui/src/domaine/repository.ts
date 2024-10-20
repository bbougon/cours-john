import { BookmarkRepository } from './bookmark/Bookmark.ts';
import { VideoPlayerRepository } from './VideoPlayer.ts';
import { MemoryRepositories } from '../infrastructure/repositories/memory/repositories.ts';
import { GuitarClassRepository } from './class/classes.ts';
import { YoutubeGuitarClassRepository } from '../infrastructure/repositories/youtube/YoutubeGuitarClassRepository.ts';
import { YoutubeVideoPlayerRepository } from '../infrastructure/repositories/youtube/YoutubeVideoPlayerRepository.ts';
import { ArtistRepository } from './class/Artist.ts';
import { YoutubeArtistRepository } from '../infrastructure/repositories/youtube/YoutubeArtistRepository.ts';
import { LastVideosRepository } from './last-videos/lastVideo.ts';
import { YoutubeLastVideosRepository } from '../infrastructure/repositories/youtube/YoutubeLastVideosRepository.ts';

export interface Repository<T> {
  persist(entity: T): void;
}

export interface Repositories {
  bookmarks(): BookmarkRepository;

  videoPlayer(): VideoPlayerRepository;

  guitarClass(): GuitarClassRepository;

  artists(): ArtistRepository;

  lastVideos(): LastVideosRepository;
}

class JohnRepositories implements Repositories {
  private readonly bookmakRepository: BookmarkRepository =
    new BookmarkRepository(window.localStorage);
  private readonly videoPlayerRepository: VideoPlayerRepository =
    new YoutubeVideoPlayerRepository();
  private guitarClassRepository: GuitarClassRepository =
    new YoutubeGuitarClassRepository();
  private artistRepository: ArtistRepository = new YoutubeArtistRepository();
  private lastVideosRepository: LastVideosRepository =
    new YoutubeLastVideosRepository();

  artists(): ArtistRepository {
    return this.artistRepository;
  }

  bookmarks(): BookmarkRepository {
    return this.bookmakRepository;
  }

  guitarClass(): GuitarClassRepository {
    return this.guitarClassRepository;
  }

  videoPlayer(): VideoPlayerRepository {
    return this.videoPlayerRepository;
  }

  lastVideos(): LastVideosRepository {
    return this.lastVideosRepository;
  }
}

const repositoriesInstance: Repositories = import.meta.env.DEV
  ? new MemoryRepositories({
      fakeData: true,
      useLocalStorage: import.meta.env.VITE_USE_LOCAL_STORAGE === 'true',
    })
  : new JohnRepositories();

export const repositories = (): Repositories => {
  return repositoriesInstance;
};
