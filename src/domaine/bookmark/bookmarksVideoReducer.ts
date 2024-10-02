import { Bookmark, GuitarClass, Video } from './Bookmark.ts';

enum BookmarksVideoActionType {
  LOAD_BOOKMARKS = 'LOAD_BOOKMARKS',
  REMOVES_BOOKMARK = 'REMOVES_BOOKMARK',
}

type BookmarksVideoAction =
  | {
      type: BookmarksVideoActionType.LOAD_BOOKMARKS;
      bookmarks: Bookmark[];
    }
  | {
      type: BookmarksVideoActionType.REMOVES_BOOKMARK;
      bookmark: Bookmark;
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
    case BookmarksVideoActionType.REMOVES_BOOKMARK: {
      const bookmarks = state.bookmarks.filter(
        (b) => b.video.id !== action.bookmark.video.id
      );
      const classes = state.classes.reduce((prev, cur) => {
        prev.push({
          title: cur.title,
          classId: cur.classId,
          videos: cur.videos.filter((v) => {
            return v.id !== action.bookmark.video.id;
          }),
        });
        return prev;
      }, [] as GuitarClass[]);
      return {
        ...state,
        classes: classes.filter((guitarClass) => guitarClass.videos.length > 0),
        bookmarks,
      };
    }
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
        ([className, currentClass]) => ({
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

export const removesBookmark = (bookmark: Bookmark): BookmarksVideoAction => ({
  type: BookmarksVideoActionType.REMOVES_BOOKMARK,
  bookmark,
});
