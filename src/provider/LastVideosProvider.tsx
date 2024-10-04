import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { repositories } from '../domaine/repository.ts';
import { LastVideos } from '../domaine/last-videos/lastVideo.ts';

type LastVideosType = {
  lastVideos: LastVideos;
  numberOfLastVideos: number;
};

export const ContextLastVideos = createContext<LastVideosType>(
  {} as unknown as LastVideosType
);

export const LastVideosProvider = ({ children }: PropsWithChildren) => {
  const [hasBeenLoaded, setHasBeenLoaded] = useState(false);
  const [lastVideos, setLastVideos] = useState<LastVideos>({
    numberOfVideos: 0,
    videos: new Map(),
  });

  useEffect(() => {
    if (!hasBeenLoaded) {
      repositories()
        .lastVideos()
        .get()
        .then((lastVideos) => {
          setHasBeenLoaded(true);
          setLastVideos(lastVideos);
        });
    }
  }, [hasBeenLoaded]);

  return (
    <ContextLastVideos.Provider
      value={{ numberOfLastVideos: lastVideos.numberOfVideos, lastVideos }}
    >
      {children}
    </ContextLastVideos.Provider>
  );
};
