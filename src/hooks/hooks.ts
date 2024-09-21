import {useContext} from "react";
import {ContextArtists} from "../provider/ArtistsProvider.tsx";

export const useArtists = () => useContext(ContextArtists)