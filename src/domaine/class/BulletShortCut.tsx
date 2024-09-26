import {useCallback, useState} from 'react';
import {Artist} from "./Artist.ts";

const ALPHABET = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];

export const BulletShortCut = (properties: {
  onClick: (filter?: string) => void;
  artists: Artist[]
}) => {
  const [activeFilter, setActiveFilter] = useState('');

  const filter = useCallback((letter?: string) => {
    properties.onClick(letter);
    setActiveFilter(letter ? letter : '');
  }, []);


  return (
    <div className="grid lg:grid-cols-12 grid-cols-5 sm:grid-cols-6  pt-0.5 pb-0.5">
        <div onClick={() => filter()} className={`flex rounded-full bg-sky-200 text-center text-white mt-2 h-16 w-16 hover:bg-sky-300 cursor-pointer justify-center items-center`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" className="stroke-2 h-10 w-10">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"/>
            </svg>
        </div>
        {ALPHABET.map((letter) => (
            <div
                key={letter}
                onClick={() => filter(letter)}
                className={`inline-block rounded-full ${activeFilter === letter ? 'bg-sky-300' : properties.artists.filter(a => a.name.toLowerCase().startsWith(letter.toLowerCase())).length > 0 ? 'bg-sky-200' : 'bg-slate-200'} text-center text-white mt-2 h-16 w-16 content-evenly hover:bg-sky-300 ${properties.artists.filter(a => a.name.toLowerCase().startsWith(letter.toLowerCase())).length > 0 ? 'cursor-pointer' : 'cursor-none'}`}
            >
                {letter.toUpperCase()}
            </div>
        ))}
    </div>
  );
};
