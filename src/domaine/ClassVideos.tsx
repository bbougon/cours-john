import { Video } from './classes.ts';
import {PropsWithChildren, useCallback, useEffect, useState} from 'react';
import { execute, parametersAPIBuilder } from '../infrastructure/fetch.ts';

type ClassVideosProperties = {
  videos: Video[];
  guitarClassTitle: string;
  open: boolean;
  onClick: (player: string) => void;
};
type VideoProperties = {
  video: Video;
  onClick: (player: string) => void;
  active: boolean
};
type VideoPlayer = {
  embeddedVideo: string;
};
type VideoPlayerAPIResponse = {
  items: { player: { embedHtml: string } }[];
};

const VideoElement = (properties: PropsWithChildren<VideoProperties>) => {
  const [activeBackground, setActiveBackground] = useState<'' | 'bg-slate-200'>(
    ''
  );
  const [smallScreen, setSmallScreen] = useState(false);

  useEffect(() => {
    setSmallScreen(window.matchMedia('(max-width: 639px)').matches);
  }, [setSmallScreen]);

  const displayVideo = useCallback(() => {
    execute<VideoPlayer, VideoPlayerAPIResponse>(
      parametersAPIBuilder()
        .video(properties.video.id, smallScreen)
        .method('GET')
        .build(),
      fetch,
      async (response) => {
        const videoPlayerAPIResponse = await response;
        return {
          embeddedVideo: videoPlayerAPIResponse.items[0].player.embedHtml,
        };
      }
    ).then((videoPlayer) => {
      properties.onClick(videoPlayer.embeddedVideo);
    });
  }, [smallScreen]);

    useEffect(() => {
        setActiveBackground(properties.active ? "bg-slate-200": "")
    }, [properties.active]);
  return (
    <li className={`flex justify-between gap-x-6 py-5 pl-2 hover:bg-slate-200 ${activeBackground}`} onClick={displayVideo}>
      <div className="flex min-w-0 gap-x-4">
        <div className="min-w-0 flex-auto">{properties.video.title}</div>
      </div>
    </li>
  );
};
export const ClassVideos = (properties: ClassVideosProperties) => {
    const [currentActiveVideo, setCurrentActiveVideo] = useState("")

  return (
    <>
      <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
        <div className="sm:col-span-8 lg:col-span-7">
          <section aria-labelledby="information-heading" className="mt-2">
            <ul role="list" className="divide-y divide-gray-100">
              {properties.videos.map((video) => (
                <VideoElement
                  key={video.title.toLowerCase().replace(' ', '-')}
                  video={video}
                  onClick={(player) => {
                    setCurrentActiveVideo(video.title.toLowerCase().replace(" ", "-"))
                    properties.onClick(player);
                  }}
                  active={currentActiveVideo === video.title.toLowerCase().replace(" ", "-")}
                />
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
};
