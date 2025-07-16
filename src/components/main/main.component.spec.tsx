import { render, screen } from '@testing-library/react';
import MainComponent from './main.component';
import type { AnimeData } from '@/types/jikan.interface.ts';
import { animeMock, animeMockMinimal, paginationMock } from '@/api/jikan.mock.ts';

vi.mock('../ui/anime-card/anime-card.tsx', () => ({
  default: ({ anime }: { anime: AnimeData }) => (
    <div data-testid="anime-card">{anime.titles?.[0]?.title ?? 'Untitled'}</div>
  ),
}));

vi.mock('../ui/spinner/spinner.tsx', () => ({
  default: () => <div data-testid="spinner">Loading...</div>,
}));

describe('MainComponent', () => {
  const baseProps = {
    isLoading: false,
    error: undefined,
    searchResults: undefined,
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders spinner when isLoading is true', () => {
    render(<MainComponent {...baseProps} isLoading={true} />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders error message when error is present', () => {
    render(<MainComponent {...baseProps} error="Something went wrong" />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('renders no results message if searchResults is undefined', () => {
    render(<MainComponent {...baseProps} />);
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  it('renders no results message if searchResults is empty', () => {
    render(<MainComponent {...baseProps} searchResults={{ data: [], pagination: paginationMock }} />);
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  it('renders AnimeCard list if searchResults are present', () => {
    render(
      <MainComponent
        {...baseProps}
        searchResults={{
          data: [animeMock, animeMockMinimal],
          pagination: paginationMock,
        }}
      />,
    );

    expect(screen.getByText('Naruto')).toBeInTheDocument();
    expect(screen.getByText('Untitled')).toBeInTheDocument();
    expect(screen.getAllByTestId('anime-card')).toHaveLength(2);
  });
});
