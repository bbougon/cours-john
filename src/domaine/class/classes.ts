import { Repository } from '../repository.ts';

export type GuitarClass = {
  title: string;
  classId: string;
  videos: Video[];
};
export type VideoDTO = {
  title: string;
  id: string;
  classId: string;
  image: string
};

export type Video = {
  title: string;
  id: string;
  image: string;
};

export interface GuitarClassRepository extends Repository<GuitarClass> {
  byPlaylist(playlistId: string): Promise<GuitarClass[]>
}

const extractTitle = (titre: string) =>
  titre
    .replace(/[i|I]ntro/gm, '')
    .replace(/[b|B]end[ |s]/gm, '')
    .replace(/[a|A]rpège[ |s]/gm, '')
    .replace(/[v|V]ibrato/gm, '')
    .replace(/^électrique/gim, '')
    .replace(/(^1ere|^1er|^2ème|^3ème|4ème|5ème) partie/gim, '')
    .replace(/^1ere|^1er|^2ème|^3ème|4ème|5ème/gim, '')
    .replace(/[r|R]alenti/gm, '')
    .replace(/rythmique [0-9]/gim, '')
    .replace(/[r|R]ythmique/gm, '')
    .replace(/riff \+ pont/gim, '')
    .replace(/pont pré/gim, '')
    .replace(/le pont/gim, '')
    .replace(/pont/gim, '')
    .replace(/[r|R]iff 1/gm, '')
    .replace(/[r|R]iff 2/gm, '')
    .replace(/[r|R]iff principal/gm, '')
    .replace(/[r|R]iff/gm, '')
    .replace(/[a|A]ccords/gm, '')
    .replace(/solo acoustique/gim, '')
    .replace(/solo fin/gim, '')
    .replace(/[s|S]olo type/gm, '')
    .replace(/solo couplet/gim, '')
    .replace(/solo [0-9]/gim, '')
    .replace(/exemple de solo/gim, '')
    .replace(/solo i/gim, '')
    .replace(/solo/gim, '')
    .replace(/[p|P]art [0-9] fin/gm, '')
    .replace(/part[0-9]/gim, '')
    .replace(/part [0-9]/gim, '')
    .replace(/part i/gim, '')
    .replace(/[s|S]ortie refrain/gm, '')
    .replace(/[r|R]efrain/gm, '')
    .replace(/[g|G]ammes/gm, '')
    .replace(/[l|L]icks/gm, '')
    .replace(/[l|L]ick/gm, '')
    .replace(/[p|P]artie[0-9]/gm, '')
    .replace(/[p|P]artie [0-9]/gm, '')
    .replace(/[s|S]ortie du/gm, '')
    .replace(/[c|C]ouplet/gm, '')
    .replace(/[b|B]loc [0-9]/gm, '')
    .replace(/[f|F]in [o|O]utro/gm, '')
    .replace(/1er [o|O]utro/gm, '')
    .replace(/[o|O]utro/gm, '')
    .replace(/thème/gim, '')
    .replace(/structure/gim, '')
    .replace(/penta/gim, '')
    .replace(/explications/gim, '')
    .replace(/variantes/gim, '')
    .replace(/modulations/gim, '')
    .replace(/etche/gim, '')
    .trim()
    .toLowerCase();
export const generateGuitarClasses = (videoDTOS: VideoDTO[]): GuitarClass[] => {
  const songsTitle: Map<string, VideoDTO[]> = new Map(
    videoDTOS.map((videos) => [extractTitle(videos.title), []])
  );

  videoDTOS.forEach((video) =>
    songsTitle.get(extractTitle(video.title))?.push(video)
  );
  return Object.entries(Object.fromEntries(songsTitle)).map(
    ([title, videos]) => {
      return {
        title: `${title[0].toUpperCase()}${title.slice(1)}`,
        classId: videos[0].classId,
        videos: videos.map(({classId, ...otherAttributes}) => otherAttributes),
      };
    }
  );
};
