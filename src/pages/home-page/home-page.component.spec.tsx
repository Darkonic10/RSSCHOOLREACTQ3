import { render, screen } from '@testing-library/react';
import HomePageComponent from './home-page.component.tsx';
import type { AnimeData } from '@/types/jikan.interface.ts';
import { animeMock, animeMockMinimal, paginationMock } from '@/api/jikan.mock.ts';
import { MemoryRouter, type Navigation, useLoaderData, useNavigation } from 'react-router-dom';
import type { LoaderReturnType } from '@/pages/home-page/home-page.loader.ts';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useLoaderData: vi.fn(),
    useNavigation: vi.fn(),
  };
});

vi.mock('../ui/anime-card/anime-card.tsx', () => ({
  default: ({ anime }: { anime: AnimeData }) => (
    <div data-testid="anime-card">{anime.titles?.[0]?.title ?? 'Untitled'}</div>
  ),
}));

vi.mock('../ui/spinner/spinner.tsx', () => ({
  default: () => <div data-testid="spinner">Loading...</div>,
}));

describe('MainComponent', () => {
  const mockedUseLoaderData = vi.mocked(useLoaderData);
  const mockedUseNavigation = vi.mocked(useNavigation);

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders spinner when isLoading is true', () => {
    mockedUseNavigation.mockReturnValue({ state: 'loading' } as Navigation);
    mockedUseLoaderData.mockReturnValue({} as LoaderReturnType);

    render(<HomePageComponent />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders error message when error is present', () => {
    mockedUseNavigation.mockReturnValue({ state: 'idle' } as Navigation);
    mockedUseLoaderData.mockReturnValue({ error: 'Something went wrong' });

    render(<HomePageComponent />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('renders no results message if searchResults is undefined', () => {
    mockedUseNavigation.mockReturnValue({ state: 'idle' } as Navigation);
    mockedUseLoaderData.mockReturnValue({ error: undefined, searchResults: undefined });

    render(<HomePageComponent />);
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  it('renders no results message if searchResults is empty', () => {
    mockedUseNavigation.mockReturnValue({ state: 'idle' } as Navigation);
    mockedUseLoaderData.mockReturnValue({
      error: undefined,
      searchResults: { data: [], pagination: paginationMock },
    });

    render(<HomePageComponent />);
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  it('renders AnimeCard list and Pagination if searchResults are present', () => {
    mockedUseNavigation.mockReturnValue({ state: 'idle' } as Navigation);
    mockedUseLoaderData.mockReturnValue({
      error: undefined,
      searchResults: {
        data: [animeMock, animeMockMinimal],
        pagination: {
          ...paginationMock,
          current_page: 1,
          last_visible_page: 3,
        },
      },
    });

    render(
      <MemoryRouter initialEntries={['/?q=naruto&page=1']}>
        <HomePageComponent />
      </MemoryRouter>,
    );

    expect(screen.getAllByTestId('anime-card')).toHaveLength(2);
    expect(screen.getByText('Naruto')).toBeInTheDocument();
    expect(screen.getByText('Untitled')).toBeInTheDocument();
    expect(screen.getByText(/1 of/i)).toBeInTheDocument();
  });
});
