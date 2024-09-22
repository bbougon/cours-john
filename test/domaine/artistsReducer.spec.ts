import {describe, expect, it} from 'vitest';
import { anArtistBuilder } from '../builders';
import {artistsFiltered, artistsFilterReset, artistsLoaded, artistsReducer} from "../../src/domaine/artistsReducer";

import {Artist} from "../../src/domaine/Artist";

describe('Artists reducer', () => {
  it('Loads artists', () => {
    const johnColtrane = anArtistBuilder().withName("John Coltrane").build();
    const bobDylan = anArtistBuilder().withName("Bob Dylan").build();

    const artistsState = artistsReducer({artists: [], filteredArtists: () => []}, artistsLoaded([johnColtrane, bobDylan]));

    expect(artistsState.artists).toStrictEqual<Artist[]>([
        johnColtrane, bobDylan
    ])
      expect(artistsState.filteredArtists()).toStrictEqual<Artist[]>([
          johnColtrane, bobDylan
      ])
  });

    it('Filters artists by the first letter of their names', () => {
      const johnColtrane = anArtistBuilder().withName('John Coltrane').build();
      const bobDylan = anArtistBuilder().withName('Bob Dylan').build();

      const artistsState = artistsReducer(
        {
          artists: [johnColtrane, bobDylan],
          filteredArtists: () => [],
        },
        artistsFiltered('J')
      );

      expect(artistsState.artists).toStrictEqual<Artist[]>([
        johnColtrane,
        bobDylan,
      ]);
      expect(artistsState.filteredArtists()).toStrictEqual<Artist[]>([
        johnColtrane,
      ]);
    });

    it('Filters artists by the first letter of their names case insensitive', () => {
        const johnColtrane = anArtistBuilder().withName("john Coltrane").build();
        const bobDylan = anArtistBuilder().withName("Bob Dylan").build();

        const artistsState = artistsReducer({artists: [johnColtrane, bobDylan], filteredArtists: () => []}, artistsFiltered("J"));

        expect(artistsState.artists).toStrictEqual<Artist[]>([
            johnColtrane, bobDylan
        ])
        expect(artistsState.filteredArtists()).toStrictEqual<Artist[]>([
            johnColtrane
        ])
    });

    it('Resets filtered artists', () => {
        const johnColtrane = anArtistBuilder().withName("john Coltrane").build();
        const bobDylan = anArtistBuilder().withName("Bob Dylan").build();

        const artistsState = artistsReducer({artists: [johnColtrane, bobDylan], filteredArtists: () => [johnColtrane]}, artistsFilterReset());

        expect(artistsState.artists).toStrictEqual<Artist[]>([
            johnColtrane, bobDylan
        ])
        expect(artistsState.filteredArtists()).toStrictEqual<Artist[]>([johnColtrane, bobDylan])
    })
});