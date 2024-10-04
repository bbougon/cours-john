import { LastVideos } from './lastVideo.ts';

export type LastVideosState = {
  currentIndex: number;
  lastVideos: LastVideos;
};
type LastVideosAction =
  | {
      type: LastVideosActionType.LOAD_LAST_VIDEOS;
      lastVideos: LastVideos;
    }
  | {
      type: LastVideosActionType.MOVE_TO_NEXT;
    }
  | {
      type: LastVideosActionType.MOVE_TO_PREVIOUS;
    }
  | {
      type: LastVideosActionType.MOVE_TO_INDEX;
      index: number;
    };

enum LastVideosActionType {
  LOAD_LAST_VIDEOS = 'LOAD_LAST_VIDEOS',
  MOVE_TO_NEXT = 'MOVE_TO_NEXT',
  MOVE_TO_PREVIOUS = 'MOVE_TO_PREVIOUS',
  MOVE_TO_INDEX = 'MOVE_TO_INDEX',
}

export const lastVideosReducer = (
  state: LastVideosState,
  action: LastVideosAction
): LastVideosState => {
  switch (action.type) {
    case LastVideosActionType.MOVE_TO_INDEX: {
      const higherIndex = state.lastVideos.videos.size;
      const currentIndex =
        action.index > higherIndex ? state.currentIndex : action.index;
      return {
        ...state,
        currentIndex,
      };
    }
    case LastVideosActionType.MOVE_TO_PREVIOUS: {
      return {
        ...state,
        currentIndex:
          state.currentIndex === 1
            ? state.lastVideos.videos.size
            : state.currentIndex - 1,
      };
    }
    case LastVideosActionType.MOVE_TO_NEXT: {
      const higherIndex = state.lastVideos.videos.size;
      return {
        ...state,
        currentIndex:
          state.currentIndex === higherIndex ? 1 : state.currentIndex + 1,
      };
    }
    case LastVideosActionType.LOAD_LAST_VIDEOS: {
      return {
        ...state,
        lastVideos: action.lastVideos,
        currentIndex: 1,
      };
    }
  }
};
export const loadLastVideos = (lastVideos: LastVideos): LastVideosAction => ({
  type: LastVideosActionType.LOAD_LAST_VIDEOS,
  lastVideos,
});

export const moveToNext = (): LastVideosAction => ({
  type: LastVideosActionType.MOVE_TO_NEXT,
});

export const moveToPrevious = (): LastVideosAction => ({
  type: LastVideosActionType.MOVE_TO_PREVIOUS,
});

export const moveToIndex = (index: number): LastVideosAction => ({
  type: LastVideosActionType.MOVE_TO_INDEX,
  index,
});
