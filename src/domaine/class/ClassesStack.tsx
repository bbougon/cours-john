import { GuitarClass, Video } from './classes.ts';
import { PropsWithChildren, ReactElement, useCallback, useState } from 'react';
import { ClassVideos } from './ClassVideos.tsx';
import { useBookmarks } from '../../hooks/hooks.ts';
import { slugify } from '../../infrastructure/slugify.ts';

type ClassStackProperties = {
  classes: GuitarClass[];
};

type GuitarClassProperties = {
  guitarClass: GuitarClass;
};

const GuitarClassElement = (properties: GuitarClassProperties) => {
  const [classVideos, setClassVideos] = useState<ReactElement>(<></>);
  const [videoPlayer, setVideoPlayer] = useState<ReactElement>(<></>);
  const bookmark = useBookmarks();

  const onBookmarkClick = useCallback((video: Video) => {
    if (bookmark.isVideoBookmarked(video)) {
      bookmark.remove({
        className: properties.guitarClass.title,
        classId: properties.guitarClass.classId,
        video,
      });
    } else {
      bookmark.add({
        className: properties.guitarClass.title,
        classId: properties.guitarClass.classId,
        video,
      });
    }
  }, []);

  const showVideos = useCallback(() => {
    setClassVideos(
      <ClassVideos
        videos={properties.guitarClass.videos}
        guitarClassTitle={properties.guitarClass.title}
        open={true}
        onVideoTitleClick={(player) =>
          setVideoPlayer(
            <div dangerouslySetInnerHTML={{ __html: player }}></div>
          )
        }
        onBookmarkClick={(video) => onBookmarkClick(video)}
      />
    );
  }, []);
  return (
    <li
      className="grid cursor-pointer grid-cols-1 justify-between gap-1 gap-x-6 py-5 pl-2 hover:bg-slate-100 lg:grid-cols-4"
      onClick={showVideos}
    >
      <div className="flex min-w-0 gap-x-4">
        <div className="min-w-0 flex-auto">
          <h2 className="font-semibold">{properties.guitarClass.title}</h2>
        </div>
      </div>
      <div>{classVideos}</div>
      <div className="lg:col-span-2 lg:col-end-5">{videoPlayer}</div>
    </li>
  );
};

export const ClassesStack = (
  properties: PropsWithChildren<ClassStackProperties>
) => {
  const classes = properties.classes.map((guitarClass) => (
    <GuitarClassElement
      key={slugify(guitarClass.title)}
      guitarClass={guitarClass}
    />
  ));
  return (
    <ul
      role="list"
      className="divide-y divide-gray-100 transition delay-300 duration-300"
    >
      {classes}
    </ul>
  );
};
