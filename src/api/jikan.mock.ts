import type { AnimeData, AnimeSearchResponse, SearchPagination } from '@/types/jikan.interface.ts';

export const animeMock: AnimeData = {
  mal_id: 1,
  url: 'https://myanimelist.net/anime/1/Naruto',
  images: {
    jpg: {
      image_url: 'https://example.com/image.jpg',
      small_image_url: 'https://example.com/image-small.jpg',
      large_image_url: 'https://example.com/image-large.jpg',
    },
    webp: {
      image_url: 'https://example.com/image.webp',
      small_image_url: 'https://example.com/image-small.webp',
      large_image_url: 'https://example.com/image-large.webp',
    },
  },
  trailer: {
    youtube_id: 'abc123',
    url: 'https://youtube.com/watch?v=abc123',
    embed_url: 'https://youtube.com/embed/abc123',
  },
  approved: true,
  titles: [{ type: 'Default', title: 'Naruto' }],
  type: 'TV',
  source: 'Manga',
  episodes: 220,
  status: 'Finished Airing',
  airing: false,
  aired: {
    from: '2002-10-03T00:00:00+00:00',
    to: '2007-02-08T00:00:00+00:00',
    prop: {
      from: { day: 3, month: 10, year: 2002 },
      to: { day: 8, month: 2, year: 2007 },
      string: 'Oct 3, 2002 to Feb 8, 2007',
    },
  },
  duration: '23 min per ep',
  rating: 'PG-13 - Teens 13 or older',
  score: 8.7,
  scored_by: 1200000,
  rank: 150,
  popularity: 30,
  members: 1800000,
  favorites: 200000,
  synopsis: 'A young ninja strives to be the best.',
  background: 'This is Naruto background info.',
  season: 'fall',
  year: 2002,
  broadcast: {
    day: 'Thursday',
    time: '19:00',
    timezone: 'Asia/Tokyo',
    string: 'Thursdays at 19:00 (JST)',
  },
  producers: {
    mal_id: 1,
    type: 'producer',
    name: 'TV Tokyo',
    url: 'https://myanimelist.net/anime/producer/1/TV_Tokyo',
  },
  licensors: {
    mal_id: 2,
    type: 'licensor',
    name: 'Viz Media',
    url: 'https://myanimelist.net/anime/licensor/2/Viz_Media',
  },
  studios: {
    mal_id: 3,
    type: 'studio',
    name: 'Pierrot',
    url: 'https://myanimelist.net/anime/studio/3/Pierrot',
  },
  genres: {
    mal_id: 4,
    type: 'genre',
    name: 'Action',
    url: 'https://myanimelist.net/anime/genre/4/Action',
  },
  explicit_genres: {
    mal_id: 0,
    type: '',
    name: '',
    url: '',
  },
  themes: {
    mal_id: 29,
    type: 'theme',
    name: 'Shounen',
    url: 'https://myanimelist.net/anime/theme/29/Shounen',
  },
  demographics: {
    mal_id: 0,
    type: '',
    name: '',
    url: '',
  },
};

export const animeMockMinimal: AnimeData = {
  mal_id: 1,
  url: 'https://myanimelist.net/anime/1/Naruto',
  images: {
    jpg: {
      image_url: undefined,
      small_image_url: undefined,
      large_image_url: undefined,
    },
    webp: {
      image_url: undefined,
      small_image_url: undefined,
      large_image_url: undefined,
    },
  },
  trailer: {
    youtube_id: undefined,
    url: undefined,
    embed_url: undefined,
  },
  approved: true,
  titles: [],
  type: undefined,
  source: undefined,
  episodes: undefined,
  status: undefined,
  airing: false,
  aired: {
    from: undefined,
    to: undefined,
    prop: {
      from: undefined,
      to: undefined,
      string: undefined,
    },
  },
  duration: undefined,
  rating: undefined,
  score: undefined,
  scored_by: 0,
  rank: undefined,
  popularity: undefined,
  members: undefined,
  favorites: undefined,
  synopsis: undefined,
  background: undefined,
  season: undefined,
  year: undefined,
  broadcast: {
    day: undefined,
    time: undefined,
    timezone: undefined,
    string: undefined,
  },
  producers: {
    mal_id: 0,
    type: '',
    name: '',
    url: '',
  },
  licensors: {
    mal_id: 0,
    type: '',
    name: '',
    url: '',
  },
  studios: {
    mal_id: 0,
    type: '',
    name: '',
    url: '',
  },
  genres: {
    mal_id: 0,
    type: '',
    name: '',
    url: '',
  },
  explicit_genres: {
    mal_id: 0,
    type: '',
    name: '',
    url: '',
  },
  themes: {
    mal_id: 0,
    type: '',
    name: '',
    url: '',
  },
  demographics: {
    mal_id: 0,
    type: '',
    name: '',
    url: '',
  },
};

export const paginationMock: SearchPagination = {
  last_visible_page: 1,
  current_page: 1,
  has_next_page: true,
  items: {
    per_page: 20,
    count: 20,
    total: 100,
  },
};

export const animeResponse: AnimeSearchResponse = {
  data: [animeMock],
  pagination: paginationMock,
};
