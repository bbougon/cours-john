import { fakerFR } from '@faker-js/faker';
import { GuitarClass, Video, VideoDTO } from '../src/domaine/class/classes';
import { Artist } from '../src/domaine/class/Artist';
import {
  Bookmark,
  GuitarClass as BookmarkGuitarClass,
} from '../src/domaine/bookmark/Bookmark';
import { LastVideo } from '../src/domaine/last-videos/lastVideo.ts';
import { SearchAPIResponse } from '../src/infrastructure/api.ts';

interface Builder<T> {
  build(): T;
}

const VIDEO_PREFIXES = [
  'Riff 1',
  'riff 1',
  'Riff 2',
  'Riff partie 1',
  'Solo',
  'Solo partie 1',
  'Rythmique',
];

class VideoDTOBuilder implements Builder<VideoDTO> {
  private title: string = fakerFR.music.songName();
  private id: string = fakerFR.string.alpha(10);
  private classId: string = fakerFR.string.alpha(10);
  private image: string = fakerFR.internet.url();

  havingTitle(titre: string): VideoDTOBuilder {
    this.title = titre;
    return this;
  }

  randomNameFromPrevious(): VideoDTOBuilder {
    this.title = `${fakerFR.helpers.arrayElement(['Riff 1', 'riff 1', 'Riff 2', 'Riff partie 1', 'Solo', 'Solo partie 1', 'Rythmique'])} ${this.title}`;
    return this;
  }

  build(): VideoDTO {
    return {
      title: this.title,
      id: this.id,
      classId: this.classId,
      image: this.image,
    };
  }
}

class GuitarClassBuilder implements Builder<GuitarClass> {
  private title: string = fakerFR.music.songName();
  private videos: Video[] = [];
  private classId: string = fakerFR.string.alpha(10);

  withClassId(classId: string): GuitarClassBuilder {
    this.classId = classId;
    return this;
  }

  withVideos(videos: Video[]): GuitarClassBuilder {
    this.videos.push(...videos);
    return this;
  }

  withNumberOfVideos(numberOfVideos: number): GuitarClassBuilder {
    for (let i = 0; i < numberOfVideos; i++) {
      const video = new VideoBuilder()
        .havingTitle(this.title)
        .randomNameFromPrevious()
        .build();
      this.videos.push(video);
    }
    return this;
  }

  build(): GuitarClass {
    return {
      classId: this.classId,
      title: this.title,
      videos: this.videos,
    };
  }
}

class GuitarClassesBuilder implements Builder<GuitarClass[]> {
  private guitarClasses: GuitarClass[] = [];

  createClasses(numberOfClasses: number): GuitarClassesBuilder {
    for (let i = 0; i < numberOfClasses; i++) {
      this.guitarClasses.push(new GuitarClassBuilder().build());
    }
    return this;
  }

  build(): GuitarClass[] {
    return this.guitarClasses;
  }
}

class ArtistBuilder implements Builder<Artist> {
  private artistName: string = fakerFR.music.artist();
  private id: string = fakerFR.string.alpha(10);
  private thumbnail: string = fakerFR.image.url(VIDEO_PICTURE_SIZE);

  withName(artistName: string): ArtistBuilder {
    this.artistName = artistName;
    return this;
  }

  build(): Artist {
    return {
      name: this.artistName,
      id: this.id,
      thumbnail: this.thumbnail,
    };
  }
}

class BookmarkBuilder implements Builder<Bookmark> {
  private video: Video = aVideoBuilder().build();
  private className: string = fakerFR.music.artist();

  forClass(className: string): BookmarkBuilder {
    this.className = className;
    return this;
  }

  withVideoName(videoName: string): BookmarkBuilder {
    this.video.title = videoName;
    return this;
  }

  build(): Bookmark {
    return {
      video: this.video,
      className: this.className,
    };
  }
}

class VideoBuilder implements Builder<Video> {
  private id: string = fakerFR.string.alpha(10);
  private title: string = `${fakerFR.string.alpha(10)} - ${fakerFR.music.songName()}`;
  private image: string = fakerFR.image.url(VIDEO_PICTURE_SIZE);

  havingTitle(titre: string): VideoBuilder {
    this.title = titre;
    return this;
  }

  randomNameFromPrevious(): VideoBuilder {
    this.title = `${fakerFR.helpers.arrayElement(VIDEO_PREFIXES)} ${this.title}`;
    return this;
  }

  build(): Video {
    return {
      id: this.id,
      title: this.title,
      image: this.image,
    };
  }
}

class BookmarkClassesBuilder implements Builder<BookmarkGuitarClass> {
  private title: string = fakerFR.music.songName();
  private videos: Video[] = [];

  from(bookmarks: Bookmark[]): BookmarkClassesBuilder {
    const guitarClass = bookmarks.reduce(
      (prev, curr) => {
        prev.title = curr.className;
        prev.videos.push(curr.video);
        return prev;
      },
      { classId: '', title: '', videos: [] } as BookmarkGuitarClass
    );
    this.title = guitarClass.title;
    this.videos = guitarClass.videos;
    return this;
  }

  build(): BookmarkGuitarClass {
    return {
      title: this.title,
      videos: this.videos,
    };
  }
}

const VIDEO_PICTURE_SIZE = { width: 320, height: 180 };

export class LastVideoBuilder implements Builder<LastVideo[]> {
  private songName: string = fakerFR.music.songName();
  private numberOfVideos: number = fakerFR.number.int({ min: 10, max: 18 });

  withSongName(songName: string): LastVideoBuilder {
    this.songName = songName;
    return this;
  }

  withNumberOfVideos(numberOfVideos: number): LastVideoBuilder {
    this.numberOfVideos = numberOfVideos;
    return this;
  }

  build(): LastVideo[] {
    const lastVideos: LastVideo[] = [];
    for (let i = 0; i < this.numberOfVideos; i++) {
      lastVideos.push({
        channelId: fakerFR.string.alpha(10),
        image: fakerFR.image.url(VIDEO_PICTURE_SIZE),
        publishTime: fakerFR.date.anytime(),
        title: `${fakerFR.helpers.arrayElement(VIDEO_PREFIXES)} ${this.songName}`,
        videoId: fakerFR.string.alpha(10),
      });
    }
    return lastVideos;
  }
}

class SearchAPIResponsePayloadBuilder implements Builder<SearchAPIResponse> {
  private _numberOfVideos = 0;
  private _resultsPerPage = 0;
  private _totalResults = 0;
  private _hasNextPage = false;

  withVideos(numberOfVideos: number): SearchAPIResponsePayloadBuilder {
    this._numberOfVideos =
      this._resultsPerPage =
      this._totalResults =
        numberOfVideos;
    return this;
  }

  withNextPage(totalResults: number): SearchAPIResponsePayloadBuilder {
    this._numberOfVideos = 48;
    this._resultsPerPage = 48;
    this._totalResults = totalResults;
    this._hasNextPage = true;
    return this;
  }

  lastPage(
    numberOfVideos: number,
    totalResults: number
  ): SearchAPIResponsePayloadBuilder {
    this._numberOfVideos = numberOfVideos;
    this._resultsPerPage = 48;
    this._totalResults = totalResults;
    return this;
  }

  build(): SearchAPIResponse {
    const items: {
      id: { videoId: string };
      snippet: {
        title: string;
        channelId: string;
        thumbnails: { default: { url: string } };
        publishTime: string
      };
    }[] = [];
    for (let i = 0; i < this._numberOfVideos; i++) {
      items.push({
        id: {
          videoId: fakerFR.string.alpha(10),
        },
        snippet: {
          title: fakerFR.music.songName(),
          channelId: fakerFR.string.alpha(10),
          thumbnails: {
            default: {
              url: fakerFR.internet.url(),
            },
          },
          publishTime: fakerFR.date.anytime().toISOString(),
        },
      });
    }
    return {
      ...(this._hasNextPage && {
        nextPageToken: fakerFR.string.alpha(8),
      }),
      pageInfo: {
        resultsPerPage: this._resultsPerPage,
        totalResults: this._totalResults,
      },
      items,
    };
  }
}

export const aVideoBuilder = () => new VideoBuilder();
export const aVideoDTOBuilder = () => new VideoDTOBuilder();
export const aGuitarClassesBuilder = () => new GuitarClassesBuilder();
export const aGuitarClassBuilder = () => new GuitarClassBuilder();
export const anArtistBuilder = () => new ArtistBuilder();
export const aBookmarkBuilder = () => new BookmarkBuilder();
export const aBookmarkClassesBuilder = () => new BookmarkClassesBuilder();
export const aLastVideosBuilder = () => new LastVideoBuilder();
export const aSearchAPIResponsePayloadBuilder = () =>
  new SearchAPIResponsePayloadBuilder();
