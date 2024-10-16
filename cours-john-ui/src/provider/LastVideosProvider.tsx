import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { repositories } from '../domaine/repository.ts';
import { LastVideos } from '../domaine/last-videos/lastVideo.ts';
import { useErrorBoundary } from 'react-error-boundary';

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
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    if (!hasBeenLoaded) {
      repositories()
        .lastVideos()
        .get()
        .then((lastVideos) => {
          setHasBeenLoaded(true);
          setLastVideos(lastVideos);
        })
        .catch((error) => showBoundary(error));
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
