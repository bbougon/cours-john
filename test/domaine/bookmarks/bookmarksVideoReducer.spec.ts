import { describe, expect, it } from 'vitest';
import { aBookmarkBuilder, aBookmarkClassesBuilder } from '../../builders';
import {
  removesBookmark,
  bookmarksVideoReducer,
  BookmarksVideoState,
  loadBookmarks,
} from '../../../src/domaine/bookmark/bookmarksVideoReducer';

describe('Bookmarks Video Reducer', () => {
  it('Load bookmarks to reduce them into video classes', () => {
    const bigGuns = aBookmarkBuilder()
      .forClass('Big guns')
      .withVideoName('Intro Big guns')
      .build();
    const introEnterSandman = aBookmarkBuilder()
      .forClass('Enter Sandman')
      .withVideoName('Intro Enter Sandman')
      .build();
    const coupletEnterSandman = aBookmarkBuilder()
      .forClass('Enter Sandman')
      .withVideoName('Couplet Enter Sandman')
      .build();

    const bookmarksVideoState = bookmarksVideoReducer(
      {
        bookmarks: [bigGuns, introEnterSandman, coupletEnterSandman],
        classes: [],
      },
      loadBookmarks([bigGuns, introEnterSandman, coupletEnterSandman])
    );

    expect(bookmarksVideoState).toStrictEqual<BookmarksVideoState>({
      bookmarks: [bigGuns, introEnterSandman, coupletEnterSandman],
      classes: [
        {
          title: 'Big guns',
          classId: bigGuns.classId,
          videos: [
            {
              title: 'Intro Big guns',
              id: bigGuns.video.id,
              image: bigGuns.video.image,
            },
          ],
        },
        {
          title: 'Enter Sandman',
          classId: introEnterSandman.classId,
          videos: [
            {
              title: 'Intro Enter Sandman',
              id: introEnterSandman.video.id,
              image: introEnterSandman.video.image,
            },
            {
              title: 'Couplet Enter Sandman',
              id: coupletEnterSandman.video.id,
              image: coupletEnterSandman.video.image,
            },
          ],
        },
      ],
    });
  });

  it('Removes a bookmark', () => {
    const introEnterSandman = aBookmarkBuilder()
      .forClass('Enter Sandman')
      .withVideoName('Intro Enter Sandman')
      .build();
    const coupletEnterSandman = aBookmarkBuilder()
      .forClass('Enter Sandman')
      .withVideoName('Couplet Enter Sandman')
      .build();

    const bookmarksVideoState = bookmarksVideoReducer(
      {
        bookmarks: [introEnterSandman, coupletEnterSandman],
        classes: [
          aBookmarkClassesBuilder()
            .from([introEnterSandman, coupletEnterSandman])
            .build(),
        ],
      },
      removesBookmark(introEnterSandman)
    );

    expect(bookmarksVideoState).toStrictEqual<BookmarksVideoState>({
      bookmarks: [coupletEnterSandman],
      classes: [
        {
          title: 'Enter Sandman',
          classId: coupletEnterSandman.classId,
          videos: [
            {
              title: 'Couplet Enter Sandman',
              id: coupletEnterSandman.video.id,
              image: coupletEnterSandman.video.image,
            },
          ],
        },
      ],
    });
  });

  it('Removes the class if the bookmark was the last', () => {
    const introEnterSandman = aBookmarkBuilder()
      .forClass('Enter Sandman')
      .withVideoName('Intro Enter Sandman')
      .build();

    const bookmarksVideoState = bookmarksVideoReducer(
      {
        bookmarks: [introEnterSandman],
        classes: [aBookmarkClassesBuilder().from([introEnterSandman]).build()],
      },
      removesBookmark(introEnterSandman)
    );

    expect(bookmarksVideoState).toStrictEqual<BookmarksVideoState>({
      bookmarks: [],
      classes: [],
    });
  });
});
