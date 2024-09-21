import {GuitarClass, VideoDTO} from '../src/domaine/classes';
import { fakerFR } from '@faker-js/faker';

interface Builder<T> {
  build(): T;
}

class VideoDTOBuilder implements Builder<VideoDTO> {
  private titre: string = fakerFR.music.songName();
  private identifiant: string = fakerFR.string.alpha();

  havingTitle(titre: string): VideoDTOBuilder {
    this.titre = titre;
    return this;
  }

  randomNameFromPrevious(): VideoDTOBuilder {
    this.titre = `${fakerFR.helpers.arrayElement(['Riff 1', 'riff 1', 'Riff 2', 'Riff partie 1', 'Solo', 'Solo partie 1', 'Rythmique'])} ${this.titre}`;
    return this;
  }

  build(): VideoDTO {
    return { title: this.titre, id: this.identifiant };
  }
}

class GuitarClassesBuilder implements Builder<GuitarClass[]> {
    private guitarClasses: GuitarClass[] = []
    createClasses(numberOfClasses: number): GuitarClassesBuilder {
        for (let i = 0; i < numberOfClasses; i++) {
            this.guitarClasses.push({title: fakerFR.music.songName(), videos: []})
        }
        return this
    }

    build(): GuitarClass[] {
        return this.guitarClasses;
    }
}

export const aVideoDTOBuilder = () => new VideoDTOBuilder();
export const aGuitarClassesBuilder = () => new GuitarClassesBuilder();