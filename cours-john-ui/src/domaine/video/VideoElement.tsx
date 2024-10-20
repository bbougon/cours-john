import { useEffect, useState } from 'react';
import { VideoPlayer } from '../VideoPlayer.ts';
import { repositories } from '../repository.ts';

export type Video = {
  title: string;
  id: string;
  image: string;
};

type VideoElementProperties = {
  videoSet: Video[];
  videoToDisplay: Video | undefined;
};

export const VideoElement = ({
  videoSet,
  videoToDisplay,
}: VideoElementProperties) => {
  const [smallScreen, setSmallScreen] = useState(false);
  const [videoPlayer, setVideoPlayer] = useState<{
    title: string;
    videoPlayer: VideoPlayer;
  }>();

  useEffect(() => {
    setSmallScreen(window.matchMedia('(max-width: 639px)').matches);
  }, [setSmallScreen]);

  useEffect(() => {
    if (videoToDisplay && videoSet.includes(videoToDisplay)) {
      repositories()
        .videoPlayer()
        .getByCriteria(videoToDisplay.id, smallScreen)
        .then((videoPlayer) =>
          setVideoPlayer({ title: videoToDisplay.title, videoPlayer })
        );
    }
  }, [smallScreen, videoToDisplay]);

  return (
    <div className="relative lg:col-span-2 lg:col-start-2 lg:row-span-2">
      <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
        <div className="px-8 pt-8 sm:px-10 sm:pt-10">
          <p className="mt-2 text-lg/7 font-medium tracking-tight text-gray-950 max-lg:text-center">
            {videoPlayer?.title || 'Video'}
          </p>
        </div>
        <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
          {videoPlayer?.videoPlayer ? (
            <div
              dangerouslySetInnerHTML={{
                __html: videoPlayer.videoPlayer.embeddedVideo,
              }}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
    </div>
  );
};
