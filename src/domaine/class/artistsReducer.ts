import { Artist } from './Artist.ts';

enum ArtistActionType {
  ARTISTS_LOADED = 'ARTISTS_LOADED',
  ARTISTS_FILTERED = 'ARTISTS_FILTERED',
  ARTISTS_FILTER_RESET = 'ARTISTS_FILTER_RESET',
}

type ArtistsState = {
  artists: Artist[];
  filteredArtists: () => Artist[];
};

type ArtistsAction =
  | {
      type: ArtistActionType.ARTISTS_LOADED;
      artists: Artist[];
    }
  | {
      type: ArtistActionType.ARTISTS_FILTERED;
      letter: string;
    }
  | {
      type: ArtistActionType.ARTISTS_FILTER_RESET;
    };

export const artistsReducer = (
  state: ArtistsState,
  action: ArtistsAction
): ArtistsState => {
  switch (action.type) {
    case ArtistActionType.ARTISTS_FILTER_RESET:
      return {
        ...state,
        filteredArtists: () => state.artists,
      };
    case ArtistActionType.ARTISTS_FILTERED:
      return {
        ...state,
        filteredArtists: () =>
          state.artists.filter((a) =>
            a.name.toLowerCase().startsWith(action.letter.toLowerCase())
          ),
      };
    case ArtistActionType.ARTISTS_LOADED:
      return {
        ...state,
        artists: action.artists,
        filteredArtists: () => action.artists,
      };
  }
};

export const artistsLoaded = (artists: Artist[]): ArtistsAction => ({
  type: ArtistActionType.ARTISTS_LOADED,
  artists,
});

export const artistsFiltered = (letter: string): ArtistsAction => ({
  type: ArtistActionType.ARTISTS_FILTERED,
  letter,
});

export const artistsFilterReset = (): ArtistsAction => ({
  type: ArtistActionType.ARTISTS_FILTER_RESET,
});
