import { Repository } from '../repository.ts';

export type LastVideos = {
  videos: Map<number, LastVideo[]>;
  numberOfVideos: number;
};

export type LastVideo = {
  title: string;
  channelId: string;
  image: string;
  publishTime: Date;
  videoId: string;
};

export type Video = {
  title: string;
  id: string;
  image: string;
};

export interface LastVideosRepository extends Repository<LastVideo> {
  get(): Promise<LastVideos>;
}
