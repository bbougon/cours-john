import { describe, expect, it } from 'vitest';
import {
  lastVideosReducer,
  LastVideosState,
  loadLastVideos,
  moveToIndex,
  moveToNext,
  moveToPrevious,
} from '../../../src/domaine/last-videos/lastVideosReducer.ts';
import { aLastVideosBuilder } from '../../builders.ts';

describe('Last videos reducer', () => {
  it('Loads the videos', () => {
    const californicationVideos = aLastVideosBuilder()
      .withSongName('Californication')
      .withNumberOfVideos(3)
      .build();
    const moneyForNothingVideos = aLastVideosBuilder()
      .withSongName('Money for nothing')
      .withNumberOfVideos(2)
      .build();
    const lastVideos = {
      numberOfVideos: 2,
      videos: new Map([
        [1, [...californicationVideos, ...moneyForNothingVideos]],
      ]),
    };

    const state = lastVideosReducer(
      { lastVideos: { numberOfVideos: 0, videos: new Map() }, currentIndex: 0 },
      loadLastVideos(lastVideos)
    );

    expect(state).toStrictEqual<LastVideosState>({
      lastVideos,
      currentIndex: 1,
    });
  });

  it('Moves to desired index', () => {
    const firstPage = aLastVideosBuilder().withNumberOfVideos(8).build();
    const secondPage = aLastVideosBuilder().withNumberOfVideos(2).build();
    const lastVideos = {
      numberOfVideos: 2,
      videos: new Map([
        [1, firstPage],
        [2, secondPage],
      ]),
    };

    const state = lastVideosReducer(
      { lastVideos, currentIndex: 1 },
      moveToIndex(2)
    );

    expect(state).toStrictEqual<LastVideosState>({
      lastVideos,
      currentIndex: 2,
    });
  });

  it('Moves to next index', () => {
    const firstPage = aLastVideosBuilder().withNumberOfVideos(8).build();
    const secondPage = aLastVideosBuilder().withNumberOfVideos(2).build();
    const lastVideos = {
      numberOfVideos: 2,
      videos: new Map([
        [1, firstPage],
        [2, secondPage],
      ]),
    };

    const state = lastVideosReducer(
      { lastVideos, currentIndex: 1 },
      moveToNext()
    );

    expect(state).toStrictEqual<LastVideosState>({
      lastVideos,
      currentIndex: 2,
    });
  });

  it('Moves to first index if it reaches the end', () => {
    const firstPage = aLastVideosBuilder().withNumberOfVideos(8).build();
    const secondPage = aLastVideosBuilder().withNumberOfVideos(2).build();
    const lastVideos = {
      numberOfVideos: 10,
      videos: new Map([
        [1, firstPage],
        [2, secondPage],
      ]),
    };

    const state = lastVideosReducer(
      { lastVideos, currentIndex: 2 },
      moveToNext()
    );

    expect(state).toStrictEqual<LastVideosState>({
      lastVideos,
      currentIndex: 1,
    });
  });

  it('Moves to previous index', () => {
    const firstPage = aLastVideosBuilder().withNumberOfVideos(8).build();
    const secondPage = aLastVideosBuilder().withNumberOfVideos(8).build();
    const thirdPage = aLastVideosBuilder().withNumberOfVideos(4).build();
    const lastVideos = {
      numberOfVideos: 2,
      videos: new Map([
        [1, firstPage],
        [2, secondPage],
        [3, thirdPage],
      ]),
    };

    const state = lastVideosReducer(
      { lastVideos, currentIndex: 2 },
      moveToPrevious()
    );

    expect(state).toStrictEqual<LastVideosState>({
      lastVideos,
      currentIndex: 1,
    });
  });

  it('Moves to last index if it reaches the start', () => {
    const firstPage = aLastVideosBuilder().withNumberOfVideos(8).build();
    const secondPage = aLastVideosBuilder().withNumberOfVideos(2).build();
    const thirdPage = aLastVideosBuilder().withNumberOfVideos(2).build();
    const lastVideos = {
      numberOfVideos: 12,
      videos: new Map([
        [1, firstPage],
        [2, secondPage],
        [3, thirdPage],
      ]),
    };

    const state = lastVideosReducer(
      { lastVideos, currentIndex: 1 },
      moveToPrevious()
    );

    expect(state).toStrictEqual<LastVideosState>({
      lastVideos,
      currentIndex: 3,
    });
  });

  it('Stays at the current index if the intended index does not exist', () => {
    const firstPage = aLastVideosBuilder().withNumberOfVideos(8).build();
    const secondPage = aLastVideosBuilder().withNumberOfVideos(8).build();
    const thirdPage = aLastVideosBuilder().withNumberOfVideos(4).build();
    const lastVideos = {
      numberOfVideos: 2,
      videos: new Map([
        [1, firstPage],
        [2, secondPage],
        [3, thirdPage],
      ]),
    };

    const state = lastVideosReducer(
      { lastVideos, currentIndex: 3 },
      moveToIndex(4)
    );

    expect(state).toStrictEqual<LastVideosState>({
      lastVideos,
      currentIndex: 3,
    });
  });
});
