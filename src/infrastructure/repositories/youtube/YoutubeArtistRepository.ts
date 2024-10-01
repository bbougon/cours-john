import { Artist, ArtistRepository } from '../../../domaine/class/Artist.ts';
import { execute, parametersAPIBuilder } from '../../fetch.ts';
import { ArtistAPIResponse } from '../../api.ts';

export class YoutubeArtistRepository implements ArtistRepository {
  getAll(): Promise<Artist[]> {
    return execute<Artist[], ArtistAPIResponse>(
      parametersAPIBuilder().playlists().method('GET').build(),
      fetch,
      async (reponse) => {
        const artistsDTO = await reponse;
        const artists = artistsDTO.items.map((a) => ({
          name: a.snippet.title,
          id: a.id,
          thumbnail: a.snippet.thumbnails.default.url,
        }));
        const prochainePage = artistsDTO.nextPageToken;
        if (prochainePage) {
          return this.paginate(prochainePage, artists);
        }
        return artists;
      }
    );
  }

  private async paginate(
    pageToken: string | undefined,
    artists: Artist[]
  ): Promise<Artist[]> {
    if (pageToken) {
      return execute<Artist[], ArtistAPIResponse>(
        parametersAPIBuilder().playlists(pageToken).method('GET').build(),
        fetch,
        async (response) => {
          const artistsDTO = await response;
          artists.push(
            ...artistsDTO.items.map((a) => ({
              name: a.snippet.title,
              id: a.id,
              thumbnail: a.snippet.thumbnails.default.url,
            }))
          );
          const prochainePage = artistsDTO.nextPageToken;
          if (prochainePage) {
            return this.paginate(prochainePage, artists);
          }
          return artists;
        }
      ).then((artists) => artists);
    }
    return artists;
  }

  persist(_entity: Artist) {
    throw new Error(
      'Method persist in YoutubeArtistRepository not implemented'
    );
  }
}
