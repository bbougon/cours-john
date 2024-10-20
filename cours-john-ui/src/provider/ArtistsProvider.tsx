import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { Artist } from '../domaine/class/Artist.ts';
import { repositories } from '../domaine/repository.ts';
import { useErrorBoundary } from 'react-error-boundary';

type ArtistsProviderType = {
  artists: () => Artist[];
};

export const ContextArtists = createContext<ArtistsProviderType>({
  etat: [],
} as unknown as ArtistsProviderType);

export const ArtistsProvider = ({ children }: PropsWithChildren) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    if (artists.length === 0) {
      repositories()
        .artists()
        .getAll()
        .then((artists: Artist[]) => {
          artists.sort((a, b) => (a.name > b.name ? 1 : -1));
          return artists;
        })
        .then((artists) => {
          setArtists(artists);
        })
        .catch((error) => showBoundary(error));
    }
  }, [artists.length, showBoundary]);

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
