import { createContext, PropsWithChildren, useCallback, useState } from 'react';
import { repositories } from '../domaine/repository.ts';
import { Bookmark, Video } from '../domaine/bookmark/Bookmark.ts';

type BookmarkProviderType = {
  add: (bookmark: Bookmark) => void;
  remove: (bookmark: Bookmark) => void;
  list: () => Bookmark[];
  isVideoBookmarked: (video: Video) => boolean;
  numberOfBookmarks: number;
};

export const ContextBookmarks = createContext<BookmarkProviderType>(
  {} as unknown as BookmarkProviderType
);

export const BookmarksProvider = ({ children }: PropsWithChildren) => {
  const [numberOfBookmarks, setNumberOfBookmarks] = useState(0);
  const add = useCallback(
    (bookmark: Bookmark) => {
      repositories().bookmarks().persist(bookmark);
      setNumberOfBookmarks(repositories().bookmarks().getAll().length);
    },
    [numberOfBookmarks]
  );

  const remove = (bookmark: Bookmark) => {
    repositories().bookmarks().delete(bookmark);
    setNumberOfBookmarks(repositories().bookmarks().getAll().length);
  };

  const list = useCallback((): Bookmark[] => {
    const bookmarks = repositories().bookmarks().getAll().reverse();
    setNumberOfBookmarks(bookmarks.length);
    return bookmarks;
  }, []);

  const isVideoBookmarked = (video: Video) => {
    return !!repositories().bookmarks().findByVideoId(video.id);
  };
  return (
    <ContextBookmarks.Provider
      value={{ numberOfBookmarks, add, remove, list, isVideoBookmarked }}
    >
      {children}
    </ContextBookmarks.Provider>
  );
};
