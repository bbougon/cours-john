type APIParameters<BODY = void> = {
  url: string;
  method: string;
  body?: BODY;
  headers?: Record<string, string>;
};

class ParametersAPIBuilder<CORPS = void> {
  private readonly youtubeURL = 'https://www.googleapis.com/youtube/v3/';
  private _url = '';
  private _method = '';
  private _body: CORPS | undefined = undefined;
  private _headers: { Accept: string; 'Content-Type': string } = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  playlists(tokenPage?: string): ParametersAPIBuilder<CORPS> {
    this._url = `${this.youtubeURL}playlists?key=${import.meta.env['VITE_YOUTUBE_API_KEY']}&part=snippet&channelId=${import.meta.env['VITE_YOUTUBE_CHANNEL_ID']}${tokenPage ? `&pageToken=${tokenPage}` : ''}&maxResults=50`;
    return this;
  }

  playlistItems(playlistId: string): ParametersAPIBuilder<CORPS> {
    this._url = `${this.youtubeURL}playlistItems?key=${import.meta.env['VITE_YOUTUBE_API_KEY']}&part=snippet&playlistId=${playlistId}&maxResults=50`;
    return this;
  }

  video(videoId: string, smallScreen?: boolean): ParametersAPIBuilder<CORPS> {
    this._url = `${this.youtubeURL}videos?key=${import.meta.env['VITE_YOUTUBE_API_KEY']}&part=player${smallScreen ? '&maxWidth=290' : ''}&id=${videoId}`;
    return this;
  }

  searchLastVideos(
    from: Date,
    tokenPage?: string
  ): ParametersAPIBuilder<CORPS> {
    this._url = `${this.youtubeURL}search?key=${import.meta.env['VITE_YOUTUBE_API_KEY']}&part=snippet&channelId=${import.meta.env['VITE_YOUTUBE_CHANNEL_ID']}&publishedAfter=${from.toISOString()}&order=date${tokenPage ? `&pageToken=${tokenPage}` : ''}&maxResults=48`;
    return this;
  }

  method(method: string): ParametersAPIBuilder<CORPS> {
    this._method = method;
    return this;
  }

  build(): APIParameters<CORPS> {
    return {
      url: this._url,
      method: this._method,
      ...(this._body && { corps: this._body }),
      headers: this._headers,
    };
  }
}

export const parametersAPIBuilder = <BODY = void>() =>
  new ParametersAPIBuilder<BODY>();

export const execute = async <RESPONSE, APIRESPONSE, BODY = void>(
  apiParameters: APIParameters<BODY>,
  call: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
  map: (content: Promise<APIRESPONSE>) => Promise<RESPONSE>
): Promise<RESPONSE> => {
  return call(apiParameters.url, {
    method: apiParameters.method,
    ...(apiParameters.body && {
      body: JSON.stringify(apiParameters.body),
    }),
    headers: {
      Accept: apiParameters.headers?.['Accept'] || 'application/json',
      'Content-Type':
        apiParameters.headers?.['Content-Type'] || 'application/json',
    },
  }).then(async (response) => {
    if (!response.ok) {
      return Promise.reject(await response.json());
    }
    return map(await response.json());
  });
};
