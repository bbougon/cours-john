import {useContext} from "react";
import {ContextArtists} from "../provider/ArtistsProvider.tsx";
import {ContextBookmark} from "../provider/BookmarkProvider.tsx";

export const useArtists = () => useContext(ContextArtists)
export const useBookmark = () => useContext(ContextBookmark)