import { GuitarClass } from './classes.ts';

enum ArtistCardActionType {
  GUITAR_CLASS_DISPLAYED = 'GUITAR_CLASS_DISPLAYED',
  GUITAR_CLASS_HIDDEN = 'GUITAR_CLASS_HIDDEN',
}
type ArtistCardState = {
  colSpan: 'lg:col-span-1' | 'lg:col-span-3';
  guitarClasses: GuitarClass[];
};

type ArtistCardAction =
  | {
      type: ArtistCardActionType.GUITAR_CLASS_DISPLAYED;
      guitarClasses: GuitarClass[];
    }
  | {
      type: ArtistCardActionType.GUITAR_CLASS_HIDDEN;
    };

export const artistCardReducer = (
  state: ArtistCardState,
  action: ArtistCardAction
): ArtistCardState => {
  switch (action.type) {
    case ArtistCardActionType.GUITAR_CLASS_HIDDEN:
      return {
        ...state,
        colSpan: 'lg:col-span-1',
        guitarClasses: [],
      };
    case ArtistCardActionType.GUITAR_CLASS_DISPLAYED: {
      return {
        ...state,
        colSpan: 'lg:col-span-3',
        guitarClasses: action.guitarClasses,
      };
    }
  }
};

export const displayGuitarClasses = (
  guitarClasses: GuitarClass[]
): ArtistCardAction => {
  return {
    type: ArtistCardActionType.GUITAR_CLASS_DISPLAYED,
    guitarClasses,
  };
};

export const hideGuitarClasses = (): ArtistCardAction => {
  return {
    type: ArtistCardActionType.GUITAR_CLASS_HIDDEN,
  };
};
