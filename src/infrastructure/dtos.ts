type ArtistDTO = {
    id: string;
    snippet: {
        title: string;
    };
};
type APIResponse<T> = {
    nextPageToken: string;
    items: T[];
};
export type ArtistAPIResponse = APIResponse<ArtistDTO>;
export type VideoAPIResponse = APIResponse<{
    snippet: { title: string; resourceId: { videoId: string } };
    id: string;
}>;