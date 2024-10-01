import { Repository } from '../repository.ts';

export type Artist = {
    id: string;
    name: string;
    thumbnail: string;
};

export interface ArtistRepository extends Repository<Artist> {
  getAll(): Promise<Artist[]>
}