import { searchAnime } from '@/api/jikan.ts';
import { homePageLoader, type LoaderReturnType } from '@/pages/home-page/home-page.loader.ts';
import type { LoaderFunctionArgs } from 'react-router-dom';
import type { AnimeSearchResponse } from '@/types/jikan.interface.ts';
import { localStorageMock, paginationMock } from '@/mocks';

vi.mock('@/api/jikan.ts', () => ({
  searchAnime: vi.fn(),
}));

describe('homePageLoader', () => {
  const mockedSearchAnime = searchAnime as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.stubGlobal('localStorage', localStorageMock);
    localStorage.clear();
    vi.resetAllMocks();
  });

  function makeRequest(url: string): LoaderFunctionArgs {
    return {
      request: new Request(url),
      params: {},
      context: undefined,
    };
  }

  it('redirects if "q" or "page" param is missing', async () => {
    localStorage.setItem('lastSearch', JSON.stringify('naruto'));

    let response = await homePageLoader(makeRequest('http://localhost/?page=2'));
    expect(response).toHaveProperty('status', 302);
    if ('headers' in response) {
      expect(response.headers.get('Location')).toContain('q=naruto');
    }

    response = await homePageLoader(makeRequest('http://localhost/?q=naruto'));
    expect(response).toHaveProperty('status', 302);
    if ('headers' in response) {
      expect(response.headers.get('Location')).toContain('page=1');
    }
  });

  it('calls searchAnime with correct query and page', async () => {
    const animeResponse: AnimeSearchResponse = { data: [], pagination: paginationMock };

    mockedSearchAnime.mockResolvedValue(animeResponse);

    const result = await homePageLoader(makeRequest('http://localhost/?q=bleach&page=3'));

    expect(mockedSearchAnime).toHaveBeenCalledWith('bleach', 3, 20);
    expect(result).toEqual({ searchResults: animeResponse });
  });

  it('uses lastSearch from localStorage if query param is empty', async () => {
    const animeResponse: AnimeSearchResponse = { data: [], pagination: paginationMock };

    mockedSearchAnime.mockResolvedValue(animeResponse);

    localStorage.setItem('lastSearch', JSON.stringify('one piece'));
    const result = await homePageLoader(makeRequest('http://localhost/?q=&page=1'));

    expect(mockedSearchAnime).toHaveBeenCalledWith('one piece', 1, 20);
    expect(result).toEqual({ searchResults: animeResponse });
  });

  it('returns error on searchAnime failure', async () => {
    mockedSearchAnime.mockRejectedValue(new Error('API failure'));

    const result = await homePageLoader(makeRequest('http://localhost/?q=naruto&page=1'));

    expect(result).toHaveProperty('error');
    expect((result as LoaderReturnType).error).toContain('API failure');
  });
});
