import { Video } from './classes.ts';
import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useBookmarks } from '../../hooks/hooks.ts';
import { slugify } from '../../infrastructure/slugify.ts';
import { repositories } from '../repository.ts';
import { BookmarkButton } from '../bookmark/BookmarkButton.tsx';

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
    repositories()
      .videoPlayer()
      .getByCriteria(properties.video.id, smallScreen)
      .then((videoPlayer) => {
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
      <div className="grid grid-cols-6 gap-1">
        <div
          className="col-span-5 min-w-0 flex-auto content-center"
          onClick={displayVideo}
        >
          {properties.video.title}
        </div>
        <div className="min-w-0 flex-auto">
          <BookmarkButton
            onBookmarkClick={onBookmarkClick}
            bookmarked={bookmark.isVideoBookmarked(properties.video)}
          />
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
        <div className="sm:col-span-8 lg:col-span-10">
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
