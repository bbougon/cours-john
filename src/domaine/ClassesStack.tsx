import { GuitarClass } from './classes.ts';
import {PropsWithChildren} from "react";

type ClassStackProperties = {
  classes: GuitarClass[];
};

type GuitarClassProperties = {
  guitarClass: GuitarClass;
};

const GuitarClassElement = (properties: GuitarClassProperties) => {
  return (
    <li className="justify-between gap-x-6 py-5 hover:bg-slate-100 cursor-pointer pl-2 grid grid-cols-4 gap-1">
      <div className="flex min-w-0 gap-x-4">
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-900">
            {properties.guitarClass.title}
          </p>
        </div>
      </div>
    </li>
  );
};

export const ClassesStack = (properties: PropsWithChildren<ClassStackProperties>) => {
  const classes = properties.classes.map((guitarClass) => (
    <GuitarClassElement key={guitarClass.title.toLowerCase().replace(" ", "-")} guitarClass={guitarClass} />
  ));
  return (
    <ul  role="list" className="divide-y divide-gray-100">
      {classes}
    </ul>
  );
};
