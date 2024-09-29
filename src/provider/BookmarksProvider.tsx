import { createContext, PropsWithChildren, useCallback, useState } from 'react';
import { Repositories } from '../domaine/repository.ts';
import { Bookmark } from '../domaine/bookmark/Bookmark.ts';
import { Video } from '../domaine/class/classes.ts';

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
  const add = useCallback((bookmark: Bookmark) => {
    Repositories.bookmarks().persist(bookmark);
    setNumberOfBookmarks(numberOfBookmarks + 1);
  }, [numberOfBookmarks]);

  const remove = (bookmark: Bookmark) => {
    Repositories.bookmarks().delete(bookmark);
  };

  const list = useCallback((): Bookmark[] => {
    const bookmarks = Repositories.bookmarks().getAll().reverse();
    setNumberOfBookmarks(bookmarks.length);
    return bookmarks;
  }, []);

  const isVideoBookmarked = (video: Video) => {
    return !!Repositories.bookmarks().findByVideoId(video.id);
  };
  return (
    <ContextBookmarks.Provider
      value={{ numberOfBookmarks, add, remove, list, isVideoBookmarked }}
    >
      {children}
    </ContextBookmarks.Provider>
  );
};
