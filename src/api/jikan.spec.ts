import { getAnimeById, searchAnime } from './jikan.ts';
import { animeMock, animeResponse } from '@/api/jikan.mock.ts';

describe('searchAnime', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('calls fetch with correct URL and returns JSON', async () => {
    const mockFetch = fetch as unknown as ReturnType<typeof vi.fn>;

    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(animeResponse),
    });

    const result = await searchAnime('Naruto', 1, 20);

    expect(fetch).toHaveBeenCalledWith('https://api.jikan.moe/v4/anime?q=Naruto&page=1&limit=20');
    expect(result).toEqual(animeResponse);
  });

  it('throws an error if response is not ok', async () => {
    const mockFetch = fetch as unknown as ReturnType<typeof vi.fn>;

    mockFetch.mockResolvedValue({
      ok: false,
      statusText: 'Bad Request',
    });

    await expect(() => searchAnime('Invalid')).rejects.toThrow('Jikan API error: Bad Request');
  });
});

describe('getAnimeById', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('calls fetch with correct URL and returns JSON', async () => {
    const mockFetch = fetch as unknown as ReturnType<typeof vi.fn>;

    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(animeMock),
    });

    const result = await getAnimeById('1');

    expect(fetch).toHaveBeenCalledWith('https://api.jikan.moe/v4/anime/1/full');
    expect(result).toEqual(animeMock);
  });

  it('throws an error if response is not ok', async () => {
    const mockFetch = fetch as unknown as ReturnType<typeof vi.fn>;

    mockFetch.mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
    });

    await expect(() => getAnimeById('9999')).rejects.toThrow('Jikan API error: Not Found');
  });
});
