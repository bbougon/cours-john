import {
  generateGuitarClasses,
  GuitarClass,
  GuitarClassRepository,
} from '../../../domaine/class/classes.ts';
import { execute, parametersAPIBuilder } from '../../fetch.ts';
import { VideoAPIResponse } from '../../api.ts';
import { mapYoutubeError } from './youtube.ts';

export class YoutubeGuitarClassRepository implements GuitarClassRepository {
  byPlaylist(playlistId: string): Promise<GuitarClass[]> {
    return execute<GuitarClass[], VideoAPIResponse>(
      parametersAPIBuilder().playlistItems(playlistId).method('GET').build(),
      fetch,
      async (reponse) => {
        const reponseVideoDTO = await reponse;
        return generateGuitarClasses(
          reponseVideoDTO.items.map((i) => ({
            title: i.snippet.title,
            classId: i.snippet.playlistId,
            id: i.snippet.resourceId.videoId,
            image: i.snippet.thumbnails.medium.url,
          }))
        );
      }
    ).catch((error) => Promise.reject(mapYoutubeError(error)));
  }

  persist(_entity: GuitarClass): void {
    throw new Error('Method not implemented.');
  }
}
