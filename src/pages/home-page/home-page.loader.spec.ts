import { homePageLoader } from '@/pages/home-page/home-page.loader.ts';
import type { LoaderFunctionArgs } from 'react-router-dom';
import { localStorageMock } from '@/mocks';

vi.mock('@/api/jikan.ts', () => ({
  searchAnime: vi.fn(),
}));

describe('homePageLoader', () => {
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

  it('returns default values or redirects if params are missing or invalid', async () => {
    let response = await homePageLoader(makeRequest('http://localhost/?page=2'));
    expect(response).toEqual({ q: '', page: 2, details: undefined });

    response = await homePageLoader(makeRequest('http://localhost/?q=naruto'));
    expect('status' in response && response.status).toBe(302);
    if ('headers' in response) {
      expect(response.headers.get('Location')).toContain('page=1');
    }

    response = await homePageLoader(makeRequest('http://localhost/?q=naruto&page=0'));
    expect('status' in response && response.status).toBe(302);
    if ('headers' in response) {
      expect(response.headers.get('Location')).toContain('page=1');
    }
  });

  it('redirects if details param is invalid', async () => {
    const response = await homePageLoader(makeRequest('http://localhost/?q=naruto&page=1&details=abc'));
    expect(response).toHaveProperty('status', 302);
    if ('headers' in response) {
      expect(response.headers.get('Location')).not.toContain('details=abc');
    }
  });

  it('returns parameters if valid', async () => {
    const result = await homePageLoader(makeRequest('http://localhost/?q=bleach&page=3&details=42'));
    expect(result).toEqual({
      q: 'bleach',
      page: 3,
      details: 42,
    });
  });

  it('returns parameters without details if details missing', async () => {
    const result = await homePageLoader(makeRequest('http://localhost/?q=bleach&page=3'));
    expect(result).toEqual({
      q: 'bleach',
      page: 3,
      details: undefined,
    });
  });
});
