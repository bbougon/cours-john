import {
  ReactElement,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { execute, parametersAPIBuilder } from '../infrastructure/fetch.ts';
import { generateGuitarClasses, GuitarClass } from './classes.ts';
import { VideoAPIResponse } from '../infrastructure/dtos.ts';
import { useArtists } from '../hooks/hooks.ts';
import { ClassesStack } from './ClassesStack.tsx';
import {
  artistCardReducer,
  displayGuitarClasses,
  hideGuitarClasses,
} from './artistCardReducer.ts';
import { slugify } from '../infrastructure/slugify.ts';
import { Artist } from './Artist.ts';

type ArtistCardProperties = {
  artist: Artist;
};
const ArtistCard = ({ artist }: ArtistCardProperties) => {
  const [artistCardState, dispatch] = useReducer(artistCardReducer, {
    colSpan: 'lg:col-span-1',
    guitarClasses: [],
  });
  const [closeButton, setCloseButton] = useState<ReactElement>(<></>);

  const displayClasses = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement> , playlistId: string) => {
        event.preventDefault();
      if (artistCardState.guitarClasses.length === 0) {
        execute<GuitarClass[], VideoAPIResponse>(
          parametersAPIBuilder()
            .playlistItems(playlistId)
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
          .then((guitarClasses) =>
            dispatch(displayGuitarClasses(guitarClasses))
          )
          .catch((e) => console.error(e));
      } else {
        dispatch(hideGuitarClasses());
      }
    },
    [dispatch, artistCardState]
  );

  useEffect(() => {
    if (artistCardState.guitarClasses.length > 0) {
      setCloseButton(
        <button
          type="button"
          className="absolute right-2 top-2 text-gray-400 hover:text-gray-500"
          onClick={() => dispatch(hideGuitarClasses())}
        >
          <span className="sr-only">Close</span>
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      );
    } else {
      setCloseButton(<></>);
    }
  }, [artistCardState]);

  return (
    <article
      className={`${artistCardState.colSpan} transition delay-300 duration-300 border border-slate-900 rounded-md shadow-lg`}
    >
      <div className="group relative">
        <div className="grid grid-cols-12 mt-3">
          {closeButton}
          <h3 className="col-span-9 lg:col-span-10 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600 pl-2 content-evenly">
            <a href="#" onClick={(e) => displayClasses(e, artist.id)}>
              <span className="absolute inset-0"></span>
              {artist.name}
            </a>
          </h3>
          <div className="col-span-2 lg:justify-self-center">
            <img
              src={artist.thumbnail}
              alt={artist.name}
              className="h-10 w-10 rounded-full bg-gray-50"
            />
          </div>
        </div>
      </div>
      <div className="relative mt-8 items-center gap-x-4 pl-2 pr-2 py-2 grid grid-cols-1">
        <div className="text-sm leading-6">
          <ClassesStack
            key={artist.id}
            classes={artistCardState.guitarClasses}
          />
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
        <ArtistCard key={slugify(artist.name)} artist={artist} />
      ))}
    </div>
  );
};

export default Artists;
