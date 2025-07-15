import { searchAnime } from './jikan.ts';
import { animeResponse } from '@/api/jikan.mock.ts';

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
