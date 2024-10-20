import { useCallback, useEffect, useReducer, useState } from 'react';
import { useBookmarks, useLastVideos } from '../../hooks/hooks.ts';
import {
  lastVideosReducer,
  loadLastVideos,
  moveToIndex,
  moveToNext,
  moveToPrevious,
} from './lastVideosReducer.ts';
import { LastVideo, Video } from './lastVideo.ts';
import { intlFormat } from 'date-fns';
import { VideoElement } from '../video/VideoElement.tsx';
import { BookmarkButton } from '../bookmark/BookmarkButton.tsx';
import { extractTitle } from '../extractTitle.ts';

type VideoCardProperties = { video: LastVideo; onVideoClick: () => void };
const VideoCard = ({ video, onVideoClick }: VideoCardProperties) => {
  const bookmarks = useBookmarks();

  const onBookmarkClick = useCallback((title: string, video: Video) => {
    if (bookmarks.isVideoBookmarked(video)) {
      bookmarks.remove({
        className: title,
        video,
      });
    } else {
      bookmarks.add({
        className: title,
        video,
      });
    }
  }, []);

  return (
    <article
      className={`rounded-md border border-slate-900 shadow-lg transition delay-300 duration-300`}
    >
      <div className="group relative">
        <div className="mt-3 grid grid-cols-2">
          <div className="col-span-2 flex">
            <h3 className="grow content-evenly pl-2 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
              {video.title}
            </h3>
            <div className="mr-1 flex-none content-center text-end">
              {video ? (
                <BookmarkButton
                  onBookmarkClick={() =>
                    onBookmarkClick(extractTitle(video.title), {
                      title: video.title,
                      image: video.image,
                      id: video.videoId,
                    })
                  }
                  bookmarked={bookmarks.isVideoBookmarked({
                    title: video.title,
                    image: video.image,
                    id: video.videoId,
                  })}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
          <h4 className="col-span-2 pl-2 text-sm text-gray-500">
            Published {intlFormat(video.publishTime)}
          </h4>
          <div className="col-span-2 pt-2 lg:justify-self-center">
            <img
              src={video.image}
              alt={video.title}
              className="cursor-pointer"
              onClick={() => onVideoClick()}
            />
          </div>
        </div>
      </div>
    </article>
  );
};

const selectedIndex =
  'relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600';
const unselectedIndex =
  'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0';

type VideoCardsProperties = {
  videos: Map<number, LastVideo[]>;
  index: number;
  onVideoClick: (video: LastVideo) => void;
};
const VideoCards = ({ videos, index, onVideoClick }: VideoCardsProperties) => {
  const videoCards = videos
    .get(index)
    ?.map((lastVideo) => (
      <VideoCard
        key={lastVideo.videoId}
        video={lastVideo}
        onVideoClick={() => onVideoClick(lastVideo)}
      />
    )) || <></>;

  return (
    <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 grid-rows-2 gap-x-8 gap-y-8 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-4">
      {videoCards}
    </div>
  );
};

export const LastVideos = () => {
  const { lastVideos } = useLastVideos();
  const [lastVideosState, dispatch] = useReducer(lastVideosReducer, {
    currentIndex: 0,
    lastVideos: { numberOfVideos: 0, videos: new Map() },
  });
  const [videoToPlay, setVideoToPlay] = useState<Video | undefined>(undefined);

  useEffect(() => {
    dispatch(loadLastVideos(lastVideos));
  }, [lastVideos]);

  const displayVideo = useCallback((video: LastVideo) => {
    setVideoToPlay({
      title: video.title,
      id: video.videoId,
      image: video.image,
    });
  }, []);

  const navElements = Array.from(lastVideosState.lastVideos.videos.keys()).map(
    (value) => {
      return (
        <button
          key={crypto.randomUUID()}
          onClick={() => dispatch(moveToIndex(value))}
          aria-current="page"
          className={
            value === lastVideosState.currentIndex
              ? selectedIndex
              : unselectedIndex
          }
        >
          {value}
        </button>
      );
    }
  );

  return (
    <>
      <VideoCards
        videos={lastVideosState.lastVideos.videos}
        index={lastVideosState.currentIndex}
        onVideoClick={(video) => displayVideo(video)}
      />
      <div className="mt-2 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => dispatch(moveToPrevious())}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => dispatch(moveToNext())}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div className="hidden place-content-center sm:flex sm:flex-1 sm:items-center">
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={() => dispatch(moveToPrevious())}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fillRule="evenodd"
                  d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {navElements}
            <button
              onClick={() => dispatch(moveToNext())}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Next</span>
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fillRule="evenodd"
                  d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
      <div
        className={`fixed bottom-0 left-0 right-0 z-10 w-full overflow-y-auto p-4 duration-500 ease-in-out ${videoToPlay ? 'opacity-100' : '-translate-x-full opacity-0'}`}
        aria-labelledby="slide-over-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>
        <div className="fixed inset-0 overflow-hidden">
          <div className="inset-0 overflow-hidden">
            <div
              className={`pointer-events-none fixed inset-y-0 right-0 flex max-w-full transform pl-10 transition duration-500 ease-in-out sm:duration-700 ${videoToPlay ? 'translate-x-0' : 'translate-x-full'}`}
            >
              <div className="pointer-events-auto relative w-screen max-w-md">
                <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                  <button
                    onClick={() => setVideoToPlay(undefined)}
                    type="button"
                    className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <span className="absolute -inset-2.5"></span>
                    <span className="sr-only">Close panel</span>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                      data-slot="icon"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                  <div className="px-4 sm:px-6">
                    <h2
                      className="text-base font-semibold leading-6 text-gray-900"
                      id="slide-over-title"
                    >
                      {videoToPlay?.title}
                    </h2>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6">
                    {videoToPlay ? (
                      <VideoElement
                        videoSet={[videoToPlay]}
                        videoToDisplay={videoToPlay}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
