import {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import {
  execute,
  parametersAPIBuilder,
} from '../infrastructure/fetch.ts';
import {Artist} from "../domaine/class/Artist.ts";
import {ArtistAPIResponse} from "../infrastructure/api";


type ArtistsProviderType = {
  artists: () => Artist[];
};

export const ContextArtists = createContext<ArtistsProviderType>({
  etat: [],
} as unknown as ArtistsProviderType);

export const ArtistsProvider = ({ children }: PropsWithChildren) => {
  const [artists, setArtists] = useState<Artist[]>([]);

  const paginate = async (
      pageToken: string | undefined,
      artists: Artist[]
  ): Promise<Artist[]> => {
    if (pageToken) {
      return execute<Artist[], ArtistAPIResponse>(
        parametersAPIBuilder()
          .playlists(pageToken)
          .method('GET')
          .build(),
        fetch,
        async (response) => {
          const artistsDTO = await response;
          artists.push(
            ...artistsDTO.items.map((a) => ({
              name: a.snippet.title,
              id: a.id,
                thumbnail: a.snippet.thumbnails.default.url
            }))
          );
          const prochainePage = artistsDTO.nextPageToken;
          if (prochainePage) {
            return paginate(prochainePage, artists);
          }
          return artists;
        }
      ).then((artists) => artists);
    }
    return artists;
  };

  useEffect(() => {
    execute<Artist[] | undefined, ArtistAPIResponse>(
      parametersAPIBuilder()
        .playlists()
        .method('GET')
        .build(),
      fetch,
      async (reponse) => {
        const artistsDTO = await reponse;
        const artists = artistsDTO.items.map((a) => ({
          name: a.snippet.title,
          id: a.id,
            thumbnail: a.snippet.thumbnails.default.url
        }));
        const prochainePage = artistsDTO.nextPageToken;
        if (prochainePage) {
          return paginate(prochainePage, artists);
        }
        return artists;
      }
    )
      .then((artistes: Artist[] | undefined) => {
        if (artistes) {
          artistes.sort((a, b) => (a.name > b.name ? 1 : -1));
          return artistes;
        }
        return [];
      })
      .then((artists) => {
        setArtists(artists);
      });
  }, []);

  return (
    <ContextArtists.Provider
      value={{
        artists: () => {
          return artists;
        },
      }}
    >
      {children}
    </ContextArtists.Provider>
  );
};
