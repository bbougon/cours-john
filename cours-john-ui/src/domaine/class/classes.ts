import { Repository } from '../repository.ts';
import { extractTitle } from '../extractTitle.ts';

export type GuitarClass = {
  title: string;
  classId: string;
  videos: Video[];
};
export type VideoDTO = {
  title: string;
  id: string;
  classId: string;
  image: string;
};

export type Video = {
  title: string;
  id: string;
  image: string;
};

export interface GuitarClassRepository extends Repository<GuitarClass> {
  byPlaylist(playlistId: string): Promise<GuitarClass[]>;
}

export const generateGuitarClasses = (videoDTOS: VideoDTO[]): GuitarClass[] => {
  const songsTitle: Map<string, VideoDTO[]> = new Map(
    videoDTOS.map((videos) => [extractTitle(videos.title), []])
  );

  videoDTOS.forEach((video) =>
    songsTitle.get(extractTitle(video.title))?.push(video)
  );
  return Object.entries(Object.fromEntries(songsTitle))
    .map(([title, videos]) => {
      return {
        title: `${title[0].toUpperCase()}${title.slice(1)}`,
        classId: videos[0].classId,
        videos: videos
          .map(({ classId, ...otherAttributes }) => otherAttributes)
          .sort((a, b) =>
            a.title.toLowerCase() > b.title.toLowerCase() ? 0 : -1
          ),
      };
    })
    .sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase() ? 0 : -1));
};
