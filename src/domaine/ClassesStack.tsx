import { GuitarClass } from './classes.ts';
import { PropsWithChildren, ReactElement, useCallback, useState } from 'react';
import { ClassVideos } from './ClassVideos.tsx';

type ClassStackProperties = {
  classes: GuitarClass[];
};

type GuitarClassProperties = {
  guitarClass: GuitarClass;
};

const GuitarClassElement = (properties: GuitarClassProperties) => {
  const [classVideos, setClassVideos] = useState<ReactElement>(<></>);

  const showVideos = useCallback(() => {
    setClassVideos(
      <ClassVideos
        videos={properties.guitarClass.videos}
        guitarClassTitle={properties.guitarClass.title}
        open={true}
        onClose={() => setClassVideos(<></>)}
      />
    );
  }, []);
  return (
    <li className="justify-between gap-x-6 py-5 hover:bg-slate-100 cursor-pointer pl-2 grid grid-cols-4 gap-1" onClick={showVideos}>
      <div className="flex min-w-0 gap-x-4">
        <div className="min-w-0 flex-auto">
            <h2 className="font-semibold">
                {properties.guitarClass.title}
            </h2>
        </div>
        {classVideos}
      </div>
    </li>
  );
};

export const ClassesStack = (
  properties: PropsWithChildren<ClassStackProperties>
) => {
  const classes = properties.classes.map((guitarClass) => (
    <GuitarClassElement
      key={guitarClass.title.toLowerCase().replace(' ', '-')}
      guitarClass={guitarClass}
    />
  ));
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {classes}
    </ul>
  );
};
