export type AnimeSearchResponse = {
  data: AnimeData[];
  pagination: SearchPagination;
};

export type AnimeData = {
  mal_id: number;
  url: string;
  images: AnimeImg;
  trailer: AnimeTrailer;
  approved: boolean;
  titles: AnimeTitle[];
  type?: 'TV' | 'OVA' | 'Movie' | 'Special' | 'ONA' | 'Music';
  source?: string;
  episodes?: number;
  status?: 'Finished Airing' | 'Currently Airing' | 'Not yet aired';
  airing: boolean;
  aired: AnimeAired;
  duration?: string;
  rating?:
    | 'G - All Ages'
    | 'PG - Children'
    | 'PG-13 - Teens 13 or older'
    | 'R - 17+ (violence & profanity)'
    | 'R+ - Mild Nudity'
    | 'Rx - Hentai';
  score?: number;
  scored_by: number;
  rank?: number;
  popularity?: number;
  members?: number;
  favorites?: number;
  synopsis?: string;
  background?: string;
  season?: 'summer' | 'winter' | 'spring' | 'fall';
  year?: number;
  broadcast: AnimeBroadcast;
  producers: AnimeMalUrl;
  licensors: AnimeMalUrl;
  studios: AnimeMalUrl;
  genres: AnimeMalUrl;
  explicit_genres: AnimeMalUrl;
  themes: AnimeMalUrl;
  demographics: AnimeMalUrl;
};

export type AnimeMalUrl = {
  mal_id: number;
  type: string;
  name: string;
  url: string;
};

export type AnimeBroadcast = {
  day?: string;
  time?: string;
  timezone?: string;
  string?: string;
};

export type AnimeAired = {
  from?: string;
  to?: string;
  prop: AnimeAiredProp;
};

export type AnimeAiredProp = {
  from?: FromToObj;
  to?: FromToObj;
  string?: string;
};

export type FromToObj = {
  day?: number;
  month?: number;
  year?: number;
};

export type AnimeTitle = {
  type: string;
  title: string;
};

export type AnimeTrailer = {
  youtube_id?: string;
  url?: string;
  embed_url?: string;
};

export type AnimeImg = {
  jpg: AnimeImgSize;
  webp: AnimeImgSize;
};

export type AnimeImgSize = {
  image_url?: string;
  small_image_url?: string;
  large_image_url?: string;
};

export type SearchPagination = {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: PaginationItems;
};

export type PaginationItems = {
  count: number;
  total: number;
  per_page: number;
};

export type AnimeErrorResponse = {
  status: number;
  type: string;
  message: string;
  error: string;
  report_url: string;
};
