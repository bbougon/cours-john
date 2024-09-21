import { useCallback, useEffect, useState } from 'react';
import {
  execute,
  parametersAPIBuilder,
} from '../infrastructure/fetch.ts';
import { generateGuitarClasses, GuitarClass } from './classes.ts';
import { VideoAPIResponse } from '../infrastructure/dtos.ts';
import { useArtists } from '../hooks/hooks.ts';

export type Artist = {
  id: string;
  name: string;
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
    <article className="flex max-w-xl flex-col items-start justify-between">
      <div className="group relative">
        <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
          <a href="#">
            <span className="absolute inset-0"></span>
            {artist.name}
          </a>
        </h3>
      </div>
      <div className="relative mt-8 flex items-center gap-x-4">
        <div className="text-sm leading-6">
          <button onClick={() => afficheCours(artist.id)}>Cours</button>
          {cours.map((cour) => (
            <div key={cour.title.toLowerCase().replace(' ', '-')}>
              <h2>{cour.title}</h2>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};

const Artists = () => {
  let [artists, setArtists] = useState<Artist[]>([]);
  const artistsProvider = useArtists();

  useEffect(() => {
    setArtists(artistsProvider.artists());
  }, [artistsProvider]);

  return (
    <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      {artists.map((artist) => (
        <ArtistCard
          key={artist.name.toLowerCase().replace(' ', '-')}
          artist={artist}
        />
      ))}
    </div>
  );
};

export default Artists;
