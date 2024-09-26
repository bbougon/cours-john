import { createContext, PropsWithChildren } from 'react';
import { Repositories } from '../domaine/repository.ts';
import {Bookmark} from "../domaine/bookmark/Bookmark.ts";
import {Video} from "../domaine/class/classes.ts";

type BookmarkProviderType = {
  add: (bookmark: Bookmark) => void;
  remove: (bookmark: Bookmark) => void;
  list: () => Bookmark[];
  isVideoBookmarked: (video: Video) => boolean;
};

export const ContextBookmark = createContext<BookmarkProviderType>(
  {} as unknown as BookmarkProviderType
);

export const BookmarkProvider = ({ children }: PropsWithChildren) => {
  const add = (bookmark: Bookmark) => {
    Repositories.bookmarks().persist(bookmark);
  };

  const remove = (bookmark: Bookmark) => {
    Repositories.bookmarks().delete(bookmark);
  };

  const list = (): Bookmark[] => {
    return Repositories.bookmarks().getAll();
  };

  const isVideoBookmarked = (video: Video) => {
    return !!Repositories.bookmarks().findByVideoId(video.id);
  };
  return (
    <ContextBookmark.Provider value={{ add, remove, list, isVideoBookmarked }}>
      {children}
    </ContextBookmark.Provider>
  );
};
