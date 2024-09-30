import { Video } from './classes.ts';
import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useBookmarks } from '../../hooks/hooks.ts';
import { execute, parametersAPIBuilder } from '../../infrastructure/fetch.ts';
import { slugify } from '../../infrastructure/slugify.ts';
import {VideoPlayerAPIResponse} from "../../infrastructure/api";
import { VideoPlayer } from '../VideoPlayer.ts';

type ClassVideosProperties = {
  videos: Video[];
  guitarClassTitle: string;
  open: boolean;
  onVideoTitleClick: (player: string) => void;
  onBookmarkClick: (video: Video) => void;
};
type VideoProperties = {
  video: Video;
  onVideoTitleClick: (player: string) => void;
  onBookmarkClick: (video: Video) => void;
  active: boolean;
};

const VideoElement = (properties: PropsWithChildren<VideoProperties>) => {
  const [activeBackground, setActiveBackground] = useState<'' | 'bg-slate-200'>(
    ''
  );
  const [smallScreen, setSmallScreen] = useState(false);
  const bookmark = useBookmarks();

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
      properties.onVideoTitleClick(videoPlayer.embeddedVideo);
    });
  }, [smallScreen]);

  useEffect(() => {
    setActiveBackground(properties.active ? 'bg-slate-200' : '');
  }, [properties.active]);

  const onBookmarkClick = useCallback(() => {
    properties.onBookmarkClick(properties.video);
  }, []);
  return (
    <li
      className={`justify-between gap-x-6 py-5 pl-2 hover:bg-slate-200 ${activeBackground}`}
    >
      <div className="grid grid-cols-6">
        <div className="col-span-5 min-w-0 flex-auto" onClick={displayVideo}>
          {properties.video.title}
        </div>
        <div className="min-w-0 flex-auto content-evenly">
          <button className="h-4 w-4" onClick={onBookmarkClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              className={`h-4 w-4 ${bookmark.isVideoBookmarked(properties.video) ? 'fill-amber-200 stroke-amber-400 hover:fill-slate-200 hover:stroke-slate-400' : 'stroke-slate-400 hover:fill-amber-200 hover:stroke-amber-400'}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
};
export const ClassVideos = (properties: ClassVideosProperties) => {
  const [currentActiveVideo, setCurrentActiveVideo] = useState('');
  return (
    <>
      <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
        <div className="sm:col-span-8 lg:col-span-7">
          <section aria-labelledby="information-heading" className="mt-2">
            <ul role="list" className="divide-y divide-gray-100">
              {properties.videos.map((video) => (
                <VideoElement
                  key={slugify(video.title)}
                  video={video}
                  onVideoTitleClick={(player) => {
                    setCurrentActiveVideo(slugify(video.title));
                    properties.onVideoTitleClick(player);
                  }}
                  onBookmarkClick={(video) => properties.onBookmarkClick(video)}
                  active={currentActiveVideo === slugify(video.title)}
                />
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
};
