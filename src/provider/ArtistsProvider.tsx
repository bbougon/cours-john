import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { Artist } from '../domaine/class/Artist.ts';
import { repositories } from '../domaine/repository.ts';

type ArtistsProviderType = {
  artists: () => Artist[];
};

export const ContextArtists = createContext<ArtistsProviderType>({
  etat: [],
} as unknown as ArtistsProviderType);

export const ArtistsProvider = ({ children }: PropsWithChildren) => {
  const [artists, setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    repositories()
      .artists()
      .getAll()
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
