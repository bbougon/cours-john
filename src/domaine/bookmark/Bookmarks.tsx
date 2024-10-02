import { useBookmarks } from '../../hooks/hooks.ts';
import { useCallback, useEffect, useReducer, useState } from 'react';
import {
  bookmarksVideoReducer,
  loadBookmarks, removesBookmark,
} from './bookmarksVideoReducer.ts';
import { Video } from './Bookmark.ts';
import { VideoPlayer } from '../VideoPlayer.ts';
import { repositories } from '../repository.ts';

type VideoElementProperties = {
  videoSet: Video[];
  videoToDisplay: Video | undefined;
};

const VideoElement = ({ videoSet, videoToDisplay }: VideoElementProperties) => {
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

export const Bookmarks = () => {
  const bookmarks = useBookmarks();

  const [bookmarksVideoState, dispatch] = useReducer(bookmarksVideoReducer, {
    bookmarks: [],
    classes: [],
  });
  const [videoToPlay, setVideoToPlay] = useState<Video>();

  const displayVideo = useCallback((video: Video) => {
    setVideoToPlay(video);
  }, []);

  useEffect(() => {
    dispatch(loadBookmarks(bookmarks.list()));
  }, [bookmarks]);

  const onBookmarkClick = useCallback((classId: string, title: string, video: Video) => {
    dispatch(removesBookmark({ className: title, classId, video }));
    bookmarks.remove({
      className: title,
      classId,
      video,
    });
  }, [bookmarks]);

  return (
    <>
      {bookmarksVideoState.classes.map((cl) => (
        <div key={`${cl.classId}`} className="py-12">
          <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
            <div className="mt-4 grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
              <div className="relative lg:row-span-2">
                <div className="relative flex h-full flex-col gap-y-4 overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] pb-8 lg:rounded-l-[calc(2rem+1px)]">
                  <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                    <p className="mt-2 text-lg/7 font-medium tracking-tight text-gray-950 max-lg:text-center">
                      {cl.title}
                    </p>
                  </div>
                  {cl.videos.map((v) => (
                    <div
                      key={`${v.id}-bookmarked`}
                      className="relative flex min-h-[14rem] w-80 grow flex-col self-center pt-4 [container-type:inline-size] max-lg:mx-auto max-lg:max-w-sm"
                    >
                      <div className="border-1 inset-x-10 overflow-hidden rounded-t-xl border border-gray-600 py-2 pl-2">
                        <div className="min-w-0 grid grid-cols-6 grid-rows-1 content-evenly">
                          <div className="col-span-5"><p className="">{v.title}</p></div>
                          <div className="content-center text-end col-span-1">
                            <button className="h-6 w-6 align-middle" onClick={() => onBookmarkClick(cl.classId, cl.title, v)}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                className={`h-4 w-4 fill-amber-200 stroke-amber-400 hover:fill-slate-200 hover:stroke-slate-400`}
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
                      </div>
                      <div className="inset-x-10 overflow-hidden rounded-b-xl shadow-2xl">
                        <img
                          className="size-full cursor-pointer object-cover object-top"
                          src={v.image}
                          alt={cl.title}
                          onClick={() => displayVideo(v)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem] lg:rounded-l-[2rem]"></div>
              </div>
              <VideoElement videoSet={cl.videos} videoToDisplay={videoToPlay} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
