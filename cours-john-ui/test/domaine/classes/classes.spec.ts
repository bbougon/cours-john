import { describe, expect, it } from 'vitest';
import { acdcSongs, expectedACDCClasses } from './acdc';
import { ericClaptonSongs, expectedEriClaptonClasses } from './eric';
import { aVideoDTOBuilder } from '../../builders';
import {
  generateGuitarClasses,
  GuitarClass,
} from '../../../src/domaine/class/classes';

describe('Generate guitar classes', () => {
  it('For one song', () => {
    const videoDTO = aVideoDTOBuilder()
      .havingTitle('Riff you only live once')
      .build();

    const guitareClasses = generateGuitarClasses([videoDTO]);

    expect(guitareClasses).toStrictEqual<GuitarClass[]>([
      {
        title: 'You only live once',
        classId: videoDTO.classId,
        videos: [
          {
            title: 'Riff you only live once',
            id: videoDTO.id,
            image: videoDTO.image,
          },
        ],
      },
    ]);
  });

  it('For two songs', () => {
    const videoDTOBuilder = aVideoDTOBuilder();
    const videoDTO1 = videoDTOBuilder.build();
    const videoDTO2 = videoDTOBuilder.randomNameFromPrevious().build();

    const guitareClasses = generateGuitarClasses([videoDTO1, videoDTO2]);

    expect(guitareClasses).toStrictEqual<GuitarClass[]>([
      {
        title: `${videoDTO1.title[0]}${videoDTO1.title.slice(1).toLowerCase()}`,
        classId: videoDTO1.classId,
        videos: [
          { title: videoDTO1.title, id: videoDTO1.id, image: videoDTO1.image },
          { title: videoDTO2.title, id: videoDTO2.id, image: videoDTO2.image },
        ],
      },
    ]);
  });

  it.each([
    { songName: 'Arpèges wicked games', title: 'Wicked games' },
    { songName: 'Arpège wicked games', title: 'Wicked games' },
    { songName: 'Bends wicked games', title: 'Wicked games' },
    { songName: 'Bend wicked games', title: 'Wicked games' },
    { songName: 'Vibrato wicked games', title: 'Wicked games' },
    { songName: 'Lick Song name', title: 'Song name' },
  ])('For name containing $songName', (song) => {
    const lickSong = aVideoDTOBuilder().havingTitle(song.songName).build();

    const guitareClasses = generateGuitarClasses([lickSong]);

    expect(guitareClasses).toStrictEqual<GuitarClass[]>([
      {
        title: song.title,
        classId: lickSong.classId,
        videos: [
          { title: lickSong.title, id: lickSong.id, image: lickSong.image },
        ],
      },
    ]);
  });

  it('For ACDC songs', () => {
    const acdcClasses = generateGuitarClasses(acdcSongs);

    expect(acdcClasses).toStrictEqual<GuitarClass[]>(expectedACDCClasses);
  });

  it('For Eric Clapton songs', () => {
    const ericClaptonClasses = generateGuitarClasses(ericClaptonSongs);

    expect(ericClaptonClasses).toStrictEqual<GuitarClass[]>(
      expectedEriClaptonClasses
    );
  });
});
