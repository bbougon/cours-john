import { useCallback, useEffect, useState } from 'react';
import './App.css';
import {
  generateGuitarClasses,
  GuitarClass,
} from './domaine/classes.ts';
import { parametersAPIBuilder, execute } from './infrastructure/fetch.ts';

type Artist = {
  id: string;
  name: string;
};

type ArtistDTO = {
  id: string;
  snippet: {
    title: string;
  };
};

type APIResponse<T> = {
  nextPageToken: string;
  items: T[];
};
type ArtistAPIResponse = APIResponse<ArtistDTO>;
type VideoAPIResponse = APIResponse<{
  snippet: { title: string; resourceId: { videoId: string } };
  id: string;
}>;

const paginate = async (
    pageToken: string | undefined,
    artists: Artist[]
): Promise<Artist[] | undefined> => {
  if (pageToken) {
    return execute<Artist[] | undefined, ArtistAPIResponse>(
      parametersAPIBuilder()
        .playlists(pageToken)
        .method('GET')
        .build(),
      fetch,
      async (response) => {
        const artistsDTO = await response;
        artists.push(
          ...artistsDTO.items.map((a) => ({ name: a.snippet.title, id: a.id }))
        );
        const prochainePage = artistsDTO.nextPageToken;
        if (prochainePage) {
          return paginate(prochainePage, artists);
        }
        return artists;
      }
    );
  }
};

type ArtistCardProperties = {
  artist: Artist;
};
const ArtistCard = ({ artist }: ArtistCardProperties) => {
  const [cours, setCours] = useState<GuitarClass[]>([]);

  const afficheCours = useCallback(
    (identifiant: string) => {
      execute<GuitarClass[], VideoAPIResponse>(
        parametersAPIBuilder()
          .playlistItems(identifiant)
          .method('GET')
          .build(),
        fetch,
        async (reponse) => {
          const reponseVideoDTO = await reponse;
          return generateGuitarClasses(
            reponseVideoDTO.items.map((i) => ({
              title: i.snippet.title,
              id: i.snippet.resourceId.videoId,
            }))
          );
        }
      )
        .then((cours) => setCours(cours))
        .catch((e) => console.error(e));
    },
    [setCours]
  );

  return (
    <div>
      <h1>{artist.name}</h1>
      <button onClick={() => afficheCours(artist.id)}>Cours</button>
      {cours.map((cour) => (
        <div key={cour.title.toLowerCase().replace(" ", "-")}>
          <h2>{cour.title}</h2>
        </div>
      ))}
    </div>
  );
};

function App() {
  let [artists, setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    execute<Artist[] | undefined, ArtistAPIResponse>(
      parametersAPIBuilder()
        .playlists()
        .method('GET')
        .build(),
      fetch,
      async (reponse) => {
        const artistsDTO = await reponse;
        let artists = artistsDTO.items.map((a) => ({
          name: a.snippet.title,
          id: a.id,
        }));
        const prochainePage = artistsDTO.nextPageToken;
        if (prochainePage) {
          return paginate(prochainePage, artists);
        }
        return artists;
      }
    ).then((artistes: Artist[] | undefined) => {
      if (artistes) {
        artistes.sort((a, b) => (a.name > b.name ? 1 : -1));
        setArtists(artistes);
      }
    });
  }, []);

  return (
    <>
      <h1># artists: {artists.length}</h1>
      {artists.map((artist) => (
        <ArtistCard
          key={artist.name.toLowerCase().replace(' ', '-')}
          artist={artist}
        />
      ))}
    </>
  );
}

export default App;
