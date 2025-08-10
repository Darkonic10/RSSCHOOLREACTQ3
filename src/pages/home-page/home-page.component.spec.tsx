import { screen } from '@testing-library/react';
import HomePageComponent from './home-page.component.tsx';
import type { AnimeData } from '@/types/jikan.interface.ts';
import { animeMock, animeMockMinimal, paginationMock } from '@/mocks/jikan.mock.ts';
import { type Navigation, useLoaderData, useNavigation } from 'react-router-dom';
import { renderWithProviders } from '@/common/test-utils.tsx';
import { mockUseAnimeDetails, mockUseSearchAnime } from '@/mocks/useSearchAnime.mock.ts';

vi.mock('@/common/hooks/useSearchAnime', () => ({
  useSearchAnime: () => mockUseSearchAnime(),
  useAnimeDetails: () => mockUseAnimeDetails(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useLoaderData: vi.fn(),
    useNavigation: vi.fn(),
  };
});

vi.mock('../ui/anime-card/anime-card.tsx', () => ({
  default: ({ anime }: { anime: AnimeData }) => <div data-testid="anime-card">{anime.titles?.[0]?.title ?? 'Untitled'}</div>,
}));

describe('HomeComponent', () => {
  const mockedUseLoaderData = vi.mocked(useLoaderData);
  const mockedUseNavigation = vi.mocked(useNavigation);

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders spinner when isLoading is true', () => {
    mockedUseNavigation.mockReturnValue({ state: 'loading' } as Navigation);
    mockedUseLoaderData.mockReturnValue({});

    renderWithProviders(<HomePageComponent />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders error message when error is present', () => {
    mockedUseNavigation.mockReturnValue({ state: 'idle' } as Navigation);
    mockedUseLoaderData.mockReturnValue({});

    mockUseSearchAnime.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { name: 'error name', message: 'something went wrong' },
    });

    renderWithProviders(<HomePageComponent />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('renders no results message if searchResults is undefined', () => {
    mockedUseNavigation.mockReturnValue({ state: 'idle' } as Navigation);
    mockedUseLoaderData.mockReturnValue({});

    mockUseSearchAnime.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<HomePageComponent />);
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  it('renders no results message if searchResults is empty', () => {
    mockedUseNavigation.mockReturnValue({ state: 'idle' } as Navigation);
    mockedUseLoaderData.mockReturnValue({});

    mockUseSearchAnime.mockReturnValue({
      data: { data: [], pagination: paginationMock },
      isLoading: false,
      error: null,
    });

    renderWithProviders(<HomePageComponent />);
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  it('renders AnimeCard list and Pagination if searchResults are present', () => {
    mockedUseNavigation.mockReturnValue({ state: 'idle' } as Navigation);
    mockedUseLoaderData.mockReturnValue({});

    mockUseSearchAnime.mockReturnValue({
      data: {
        data: [animeMock, animeMockMinimal],
        pagination: {
          ...paginationMock,
          current_page: 1,
          last_visible_page: 3,
        },
      },
      isLoading: false,
      error: null,
    });

    renderWithProviders(<HomePageComponent />, ['/?q=naruto&page=1']);

    expect(screen.getAllByTestId('anime-card')).toHaveLength(2);
    expect(screen.getByText('Naruto')).toBeInTheDocument();
    expect(screen.getByText('Untitled')).toBeInTheDocument();
    expect(screen.getByText(/1 of/i)).toBeInTheDocument();
  });
});
