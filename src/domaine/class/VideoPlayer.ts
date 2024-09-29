export type VideoPlayer = {
    embeddedVideo: string;
};
export type VideoPlayerAPIResponse = {
    items: { player: { embedHtml: string } }[];
};