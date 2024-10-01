import {
  VideoPlayer,
  VideoPlayerRepository,
} from '../../../domaine/VideoPlayer.ts';
import { execute, parametersAPIBuilder } from '../../fetch.ts';
import { VideoPlayerAPIResponse } from '../../api.ts';

export class YoutubeVideoPlayerRepository implements VideoPlayerRepository {
  getByCriteria(id: string, smallScreen: boolean): Promise<VideoPlayer> {
    return execute<VideoPlayer, VideoPlayerAPIResponse>(
      parametersAPIBuilder().video(id, smallScreen).method('GET').build(),
      fetch,
      async (response) => {
        const videoPlayerAPIResponse = await response;
        return {
          embeddedVideo: videoPlayerAPIResponse.items[0].player.embedHtml,
        };
      }
    );
  }

  persist(_entity: VideoPlayer): void {
    throw new Error('Method not implemented.');
  }
}
