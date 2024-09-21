import { Video } from './classes.ts';
import { PropsWithChildren } from 'react';

type ClassVideosProperties = {
  videos: Video[];
  guitarClassTitle: string;
  open: boolean;
  onClose: () => void;
};
type VideoProperties = {
  video: Video;
};
const VideoElement = (properties: PropsWithChildren<VideoProperties>) => {
  return (
    <li className="flex justify-between gap-x-6 py-5">
      <div className="flex min-w-0 gap-x-4">
        <div className="min-w-0 flex-auto">{properties.video.title}</div>
      </div>
    </li>
  );
};
export const ClassVideos = (properties: ClassVideosProperties) => {
  return (
    <>
      <div className="relative z-10" role="dialog" aria-modal="true">
        <div
          className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block"
          aria-hidden="true"
        ></div>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
            <div className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
              <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                <button
                  type="button"
                  onClick={() => properties.onClose()}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                  {/*<div className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5">*/}
                  {/*    <img src="https://tailwindui.com/img/ecommerce-images/product-quick-preview-02-detail.jpg" alt="Two each of gray, white, and black shirts arranged on table." className="object-cover object-center">*/}
                  {/*</div>*/}
                  <div className="sm:col-span-8 lg:col-span-7">
                    <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">
                      {properties.guitarClassTitle}
                    </h2>

                    <section
                      aria-labelledby="information-heading"
                      className="mt-2"
                    >
                      <ul role="list" className="divide-y divide-gray-100">
                        {properties.videos.map((video) => (
                          <VideoElement
                            key={video.title.toLowerCase().replace(' ', '-')}
                            video={video}
                          />
                        ))}
                      </ul>
                    </section>
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
