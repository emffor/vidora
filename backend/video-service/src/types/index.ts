export interface VideoThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface VideoSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: {
    default: VideoThumbnail;
    medium: VideoThumbnail;
    high: VideoThumbnail;
  };
  channelTitle: string;
}

export interface VideoItem {
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId: string;
  };
  snippet: VideoSnippet;
}

export interface YouTubeSearchResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: VideoItem[];
}

export interface VideoFormatado {
  id: string;
  titulo: string;
  descricao: string;
  canal: string;
  canalId: string;
  thumbnail: string;
  publicadoEm: string;
}

export interface YouTubeVideoResponse {
  items: Array<{
    id: string;
    snippet: VideoSnippet;
  }>;
}