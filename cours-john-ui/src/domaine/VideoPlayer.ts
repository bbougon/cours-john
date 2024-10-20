import { Repository } from './repository.ts';

export type VideoPlayer = {
  embeddedVideo: string;
};
export interface VideoPlayerRepository extends Repository<VideoPlayer> {
  getByCriteria(id: string, smallScreen: boolean): Promise<VideoPlayer>;
}
