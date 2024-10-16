import { useContext } from 'react';
import { ContextArtists } from '../provider/ArtistsProvider.tsx';
import { ContextBookmarks } from '../provider/BookmarksProvider.tsx';
import { ContextLastVideos } from '../provider/LastVideosProvider.tsx';

export const useArtists = () => useContext(ContextArtists);
export const useBookmarks = () => useContext(ContextBookmarks);
export const useLastVideos = () => useContext(ContextLastVideos);
