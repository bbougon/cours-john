import { fakerFR } from '@faker-js/faker';
import {GuitarClass, Video, VideoDTO} from "../src/domaine/class/classes";
import {Artist} from "../src/domaine/class/Artist";
import {Bookmark} from "../src/domaine/bookmark/Bookmark";

interface Builder<T> {
  build(): T;
}

class VideoDTOBuilder implements Builder<VideoDTO> {
  private title: string = fakerFR.music.songName();
  private id: string = fakerFR.string.alpha();
  private classId: string = fakerFR.string.alpha();

  havingTitle(titre: string): VideoDTOBuilder {
    this.title = titre;
    return this;
  }

  randomNameFromPrevious(): VideoDTOBuilder {
    this.title = `${fakerFR.helpers.arrayElement(['Riff 1', 'riff 1', 'Riff 2', 'Riff partie 1', 'Solo', 'Solo partie 1', 'Rythmique'])} ${this.title}`;
    return this;
  }

  build(): VideoDTO {
    return { title: this.title, id: this.id, classId: this.classId };
  }
}

class GuitarClassesBuilder implements Builder<GuitarClass[]> {
  private guitarClasses: GuitarClass[] = [];

  createClasses(numberOfClasses: number): GuitarClassesBuilder {
    for (let i = 0; i < numberOfClasses; i++) {
      this.guitarClasses.push({ title: fakerFR.music.songName(), videos: [], classId: fakerFR.string.alpha() });
    }
    return this;
  }

  build(): GuitarClass[] {
    return this.guitarClasses;
  }
}

class ArtistBuilder implements Builder<Artist> {
  private artistName: string = fakerFR.music.artist();
  private id: string = fakerFR.string.alpha();
  private thumbnail: string = fakerFR.string.alpha();

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
    private classId: string = fakerFR.string.alpha();
  build(): Bookmark {
    return {
        video: this.video,
        classId: this.classId
    }
  }
}

class VideoBuilder implements Builder<Video> {
    private id: string = fakerFR.string.alpha();
    private title: string = fakerFR.music.songName();
  build(): Video {
    return {
        id: this.id,
        title: this.title
    }
  }
}

const aVideoBuilder = () => new VideoBuilder();
export const aVideoDTOBuilder = () => new VideoDTOBuilder();
export const aGuitarClassesBuilder = () => new GuitarClassesBuilder();
export const anArtistBuilder = () => new ArtistBuilder();
export const aBookmarkBuilder = () => new BookmarkBuilder();