import {
  LastVideo,
  LastVideos,
  LastVideosRepository,
} from '../../../domaine/last-videos/lastVideo.ts';
import { execute, parametersAPIBuilder } from '../../fetch.ts';
import { SearchAPIResponse } from '../../api.ts';
import { parseISO, startOfToday, sub } from 'date-fns';
import { mapYoutubeError } from './youtube.ts';

export class YoutubeLastVideosRepository implements LastVideosRepository {
  constructor(
    private readonly call: (
      input: RequestInfo | URL,
      init?: RequestInit
    ) => Promise<Response> = fetch
  ) {}

  get(): Promise<LastVideos> {
    const dateAWeekAgo = sub(startOfToday(), { weeks: 1 });
    return execute<LastVideos, SearchAPIResponse>(
      parametersAPIBuilder()
        .searchLastVideos(dateAWeekAgo)
        .method('GET')
        .build(),
      this.call,
      async (reponse) => {
        const searchAPIResponse = await reponse;
        const lastVideos: LastVideos = {
          numberOfVideos: searchAPIResponse.pageInfo.totalResults,
          videos: new Map(),
        };

        return this.retrieveLastVideos(
          searchAPIResponse,
          lastVideos,
          dateAWeekAgo
        );
      }
    ).catch((error) => Promise.reject(mapYoutubeError(error)));
  }

  private retrieveLastVideos(
    searchAPIResponse: SearchAPIResponse,
    lastVideos: LastVideos,
    dateAWeekAgo: Date,
    actualNumberOfPages: number = 0
  ) {
    const videosInResponse: LastVideo[] = searchAPIResponse.items.map((i) => ({
      title: i.snippet.title,
      channelId: i.snippet.channelId,
      image: i.snippet.thumbnails.default.url,
      publishTime: parseISO(i.snippet.publishTime),
      videoId: i.id.videoId,
    }));
    if (videosInResponse.length > 0) {
      this.fillLastVideos(videosInResponse, lastVideos, actualNumberOfPages);
      const nextPageToken = searchAPIResponse.nextPageToken;
      if (nextPageToken) {
        return this.paginate(dateAWeekAgo, nextPageToken, lastVideos);
      }
    }
    return lastVideos;
  }

  private fillLastVideos(
    videosInResponse: LastVideo[],
    lastVideos: LastVideos,
    actualNumberOfPages: number
  ) {
    const numberOfPages = Math.ceil(videosInResponse.length / 8);
    let firstStep = 0;
    for (let i = 0; i < numberOfPages; i++) {
      lastVideos.videos.set(
        actualNumberOfPages + i + 1,
        videosInResponse.slice(firstStep, firstStep + 8)
      );
      firstStep = firstStep + 8;
    }
  }

  private async paginate(
    dateAWeekAgo: Date,
    pageToken: string | undefined,
    lastVideos: LastVideos
  ): Promise<LastVideos> {
    if (pageToken) {
      return execute<LastVideos, SearchAPIResponse>(
        parametersAPIBuilder()
          .searchLastVideos(dateAWeekAgo, pageToken)
          .method('GET')
          .build(),
        this.call,
        async (response) => {
          const searchAPIResponse = await response;
          return this.retrieveLastVideos(
            searchAPIResponse,
            lastVideos,
            dateAWeekAgo,
            lastVideos.videos.size
          );
        }
      ).catch((error) => Promise.reject(mapYoutubeError(error)));
    }
    return lastVideos;
  }

  persist(_entity: LastVideo): void {
    throw new Error(
      'Method persist in YoutubeLastVideosRepository not implemented'
    );
  }
}
