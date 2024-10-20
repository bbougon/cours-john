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
        ].sort((a, b) =>
          a.title.toLowerCase() > b.title.toLowerCase() ? 0 : -1
        ),
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
    { songName: 'Thème folk My song', title: 'My song' },
    { songName: 'theme My song', title: 'My song' },
    { songName: 'Rythmique avancée My song', title: 'My song' },
    { songName: 'Pont + solo My song', title: 'My song' },
    { songName: 'Liaison pont My song', title: 'My song' },
    { songName: 'Partie II goat', title: 'Goat' },
    { songName: 'Fin intro bends My song', title: 'My song' },
    { songName: 'Thème intro 2 My song', title: 'My song' },
    { songName: 'Thème refrain 2 My song', title: 'My song' },
    { songName: 'Transition vers solo My song', title: 'My song' },
    { songName: 'Question réponse My song', title: 'My song' },
    { songName: 'Arpeges My song', title: 'My song' },
    { songName: 'Rythmique originale My song', title: 'My song' },
    { songName: 'Rythmique funky initiation My song', title: 'My song' },
    { songName: 'Détails rythmiques My song', title: 'My song' },
    { songName: 'Cover Rythmique My song', title: 'My song' },
    { songName: 'Riff Debutant My song', title: 'My song' },
    { songName: 'Riff intermédiaire My song', title: 'My song' },
    { songName: 'Riff expert My song', title: 'My song' },
    { songName: 'Technique plaqué My song', title: 'My song' },
    { songName: 'Solo style My song', title: 'My song' },
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

  it('Sorts classes by alphabetical order', () => {
    const videoDTOBuilder = aVideoDTOBuilder();
    const videoDTO1 = videoDTOBuilder.havingTitle('Solo black ice').build();
    const videoDTO2 = videoDTOBuilder.havingTitle('Intro black ice').build();
    const videoDTO3 = videoDTOBuilder.havingTitle('Pont Back in Black').build();
    const videoDTO4 = videoDTOBuilder
      .havingTitle('Intro Back in black')
      .build();

    const guitareClasses = generateGuitarClasses([
      videoDTO1,
      videoDTO2,
      videoDTO3,
      videoDTO4,
    ]);

    expect(guitareClasses).toStrictEqual<GuitarClass[]>([
      {
        title: 'Back in black',
        classId: videoDTO4.classId,
        videos: [
          { title: videoDTO4.title, id: videoDTO4.id, image: videoDTO4.image },
          { title: videoDTO3.title, id: videoDTO3.id, image: videoDTO3.image },
        ],
      },
      {
        title: 'Black ice',
        classId: videoDTO2.classId,
        videos: [
          { title: videoDTO2.title, id: videoDTO2.id, image: videoDTO2.image },
          { title: videoDTO1.title, id: videoDTO1.id, image: videoDTO1.image },
        ],
      },
    ]);
  });
});
