import {
  ReactElement,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { generateGuitarClasses, GuitarClass } from './classes.ts';
import { ClassesStack } from './ClassesStack.tsx';
import {
  artistCardReducer,
  displayGuitarClasses,
  hideGuitarClasses,
} from './artistCardReducer.ts';
import { BulletShortCut } from './BulletShortCut.tsx';
import { Artist } from './Artist.ts';
import {
  artistsFiltered,
  artistsFilterReset,
  artistsLoaded,
  artistsReducer,
} from './artistsReducer.ts';
import { execute, parametersAPIBuilder } from '../../infrastructure/fetch.ts';
import { VideoAPIResponse } from '../../infrastructure/dtos.ts';
import { useArtists } from '../../hooks/hooks.ts';
import { slugify } from '../../infrastructure/slugify.ts';

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
    (event: React.MouseEvent<HTMLAnchorElement>, playlistId: string) => {
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
                classId: i.snippet.playlistId,
                id: i.snippet.resourceId.videoId,
                image: i.snippet.thumbnails.medium.url,
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
      className={`${artistCardState.colSpan} rounded-md border border-slate-900 shadow-lg transition delay-300 duration-300`}
    >
      <div className="group relative">
        <div className="mt-3 grid grid-cols-12">
          {closeButton}
          <h3 className="col-span-9 content-evenly pl-2 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600 lg:col-span-10">
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
      <div className="relative mt-8 grid grid-cols-1 items-center gap-x-4 py-2 pl-2 pr-2">
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
  const artistsProvider = useArtists();
  const [artistsReducerState, dispatch] = useReducer(artistsReducer, {
    filteredArtists: () => [],
    artists: [],
  });

  useEffect(() => {
    dispatch(artistsLoaded(artistsProvider.artists()));
  }, [artistsProvider]);

  const filterArtists = useCallback((letter?: string) => {
    if (letter) {
      dispatch(artistsFiltered(letter));
    } else {
      dispatch(artistsFilterReset());
    }
  }, []);
  return (
    <div>
      <div>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          # artists: {artistsProvider.artists().length}
        </p>
      </div>
      <div className="pt-10">
        <BulletShortCut
          onClick={(letter) => filterArtists(letter)}
          artists={artistsReducerState.artists}
        />
      </div>
      <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {artistsReducerState.filteredArtists().map((artist) => (
          <ArtistCard key={slugify(artist.name)} artist={artist} />
        ))}
      </div>
    </div>
  );
};

export default Artists;
