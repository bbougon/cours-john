import { Bookmark, Video } from './Bookmark.ts';

enum BookmarksVideoActionType {
  LOAD_BOOKMARKS = 'LOAD_BOOKMARKS',
}

type BookmarksVideoAction = {
  type: BookmarksVideoActionType;
  bookmarks: Bookmark[];
};

type GuitarClass = {
  title: string;
  classId: string;
  videos: Video[];
};

export type BookmarksVideoState = {
  bookmarks: Bookmark[];
  classes: GuitarClass[];
};
export const bookmarksVideoReducer = (
  state: BookmarksVideoState,
  action: BookmarksVideoAction
): BookmarksVideoState => {
  switch (action.type) {
    case BookmarksVideoActionType.LOAD_BOOKMARKS: {
      const classes = action.bookmarks.reduce((previous, current) => {
        const guitarClass = previous.get(current.className);
        if (guitarClass) {
          guitarClass.videos.push(current.video);
        } else {
          previous.set(current.className, {
            videos: [current.video],
            classId: current.classId,
          });
        }
        return previous;
      }, new Map<string, { classId: string; videos: Video[] }>());
      const guitarClasses = Object.entries(Object.fromEntries(classes)).map(
        ([className, currentClass]) =>
          ({
            classId: currentClass.classId,
            title: className,
            videos: currentClass.videos,
          })
      );
      return {
        ...state,
        bookmarks: action.bookmarks,
        classes: guitarClasses,
      };
    }
  }
};

export const loadBookmarks = (bookmarks: Bookmark[]): BookmarksVideoAction => ({
  type: BookmarksVideoActionType.LOAD_BOOKMARKS,
  bookmarks,
});
