export type VideoPlayerAPIResponse = {
  items: { player: { embedHtml: string } }[];
};
export type VideoAPIResponse = APIResponse<{
  snippet: {
    title: string;
    resourceId: { videoId: string };
    playlistId: string;
    thumbnails: { medium: { url: string } };
  };
  id: string;
}>;
type APIResponse<T> = {
  nextPageToken: string;
  items: T[];
};
export type ArtistAPIResponse = APIResponse<{
  id: string;
  snippet: {
    title: string;
    thumbnails: {
      default: {
        url: string;
      };
    };
  };
}>;