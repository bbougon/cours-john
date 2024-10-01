import { useContext } from 'react';
import { ContextArtists } from '../provider/ArtistsProvider.tsx';
import { ContextBookmarks } from '../provider/BookmarksProvider.tsx';

export const useArtists = () => useContext(ContextArtists);
export const useBookmarks = () => useContext(ContextBookmarks);
