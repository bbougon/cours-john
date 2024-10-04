import { describe, expect, it } from 'vitest';
import { YoutubeLastVideosRepository } from '../../../../src/infrastructure/repositories/youtube/YoutubeLastVideosRepository.ts';
import { LastVideos } from '../../../../src/domaine/last-videos/lastVideo.ts';
import { SearchAPIResponse } from '../../../../src/infrastructure/api.ts';
import { aSearchAPIResponsePayloadBuilder } from '../../../builders.ts';
import { parseISO } from 'date-fns';

describe('Youtube last videos repository', () => {
  it('Retrieves no videos', async () => {
    const lastVideos = await new YoutubeLastVideosRepository(
      (_input, _init) => {
        return Promise.resolve(
          new ResponseBuilder<SearchAPIResponse>()
            .ok()
            .json({
              pageInfo: {
                totalResults: 0,
                resultsPerPage: 0,
              },
              items: [],
            })
            .build()
        );
      }
    ).get();

    expect(lastVideos).toStrictEqual<LastVideos>({
      numberOfVideos: 0,
      videos: new Map(),
    });
  });

  it('Retrieves 8 videos', async () => {
    const response = aSearchAPIResponsePayloadBuilder().withVideos(8).build();

    const lastVideos = await new YoutubeLastVideosRepository(
      (_input, _init) => {
        return Promise.resolve(
          new ResponseBuilder<SearchAPIResponse>().ok().json(response).build()
        );
      }
    ).get();

    expect(lastVideos).toStrictEqual<LastVideos>({
      numberOfVideos: 8,
      videos: new Map([
        [
          1,
          response.items.map((i) => ({
            title: i.snippet.title,
            channelId: i.snippet.channelId,
            image: i.snippet.thumbnails.default.url,
            publishTime: parseISO(i.snippet.publishTime),
            videoId: i.id.videoId,
          })),
        ],
      ]),
    });
  });

  it('Paginates when more than 50 videos', async () => {
    const firstResponse = aSearchAPIResponsePayloadBuilder()
      .withNextPage(62)
      .build();
    const secondResponse = aSearchAPIResponsePayloadBuilder()
      .lastPage(14, 62)
      .build();

    const lastVideos = await new YoutubeLastVideosRepository((input, _init) => {
      const url = input as RequestInfo as string;
      return Promise.resolve(
        new ResponseBuilder<SearchAPIResponse>()
          .ok()
          .json(url.includes('pageToken') ? secondResponse : firstResponse)
          .build()
      );
    }).get();

    expect(lastVideos.numberOfVideos).toBe(62);
    expect(lastVideos.videos.size).toBe(8)
  });

  it('Retrieves 48 videos and get 6 pages', async () => {
    const response = aSearchAPIResponsePayloadBuilder().withVideos(48).build();

    const lastVideos = await new YoutubeLastVideosRepository(
      (_input, _init) => {
        return Promise.resolve(
          new ResponseBuilder<SearchAPIResponse>().ok().json(response).build()
        );
      }
    ).get();

    expect(lastVideos.numberOfVideos).toBe(48);
    expect(lastVideos.videos.size).toBe(6)
    const allVideos = Array.from(lastVideos.videos.values());
    expect(allVideos.every(videos => videos.length === 8)).toBe(true)
  });
});

class ResponseBuilder<T> {
  private _ok = false;
  private _status = 404;
  private _json?: T;

  ok(): ResponseBuilder<T> {
    this._ok = true;
    this._status = 200;
    return this;
  }

  json(contenu: T): ResponseBuilder<T> {
    this._json = contenu;
    return this;
  }

  build(): Response {
    return {
      ok: this._ok,
      status: this._status,
      json: () => Promise.resolve(this._json),
    } as unknown as Response;
  }
}
