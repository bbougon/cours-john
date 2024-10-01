import { describe, expect, it } from 'vitest';
import { aGuitarClassesBuilder } from '../../builders';
import {
  artistCardReducer,
  displayGuitarClasses,
  hideGuitarClasses,
} from '../../../src/domaine/class/artistCardReducer';

describe('ArtistCard reducer', () => {
  it('Loads classes', () => {
    const guitarClasses = aGuitarClassesBuilder().createClasses(5).build();

    const artistCardState = artistCardReducer(
      { guitarClasses: [], colSpan: 'lg:col-span-1' },
      displayGuitarClasses(guitarClasses)
    );

    expect(artistCardState).toStrictEqual({
      colSpan: 'lg:col-span-3',
      guitarClasses,
    });
  });

  it('Hides classes', () => {
    const guitarClasses = aGuitarClassesBuilder().createClasses(5).build();

    const artistCardState = artistCardReducer(
      { guitarClasses, colSpan: 'lg:col-span-3' },
      hideGuitarClasses()
    );

    expect(artistCardState).toStrictEqual({
      colSpan: 'lg:col-span-1',
      guitarClasses: [],
    });
  });
});
