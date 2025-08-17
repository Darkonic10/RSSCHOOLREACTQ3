import { renderWithProviders } from '@/common/test-utils.tsx';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import AnimeDetailsComponent from './anime-details.component';
import * as router from 'react-router-dom';
import { useAnimeDetails } from '@/common/hooks';

const mockSetSearchParams = vi.fn();

vi.mock('@/common/hooks/useSearchAnime', () => ({
  useSearchAnime: vi.fn(() => ({
    data: { data: [] },
    isLoading: false,
    error: null,
  })),
  useAnimeDetails: vi.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
  })),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useSearchParams: vi.fn(() => [new URLSearchParams('details=1'), mockSetSearchParams]),
  };
});

describe('AnimeDetailsComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls getAnimeById if anime is not in searchResults', async () => {
    (router.useSearchParams as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      new URLSearchParams('details=2'),
      mockSetSearchParams,
    ]);

    (useAnimeDetails as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        mal_id: 2,
        titles: [{ title: 'Fetched Anime' }],
        images: { jpg: { image_url: 'fetched.jpg' } },
        synopsis: 'Fetched synopsis',
      },
      isLoading: false,
      error: null,
    });

    renderWithProviders(<AnimeDetailsComponent />);

    expect(await screen.findByRole('heading', { level: 2 })).toHaveTextContent('Fetched Anime');
    expect(screen.getByAltText('Fetched Anime')).toHaveAttribute('src', 'fetched.jpg');
    expect(screen.getByText('Fetched synopsis')).toBeInTheDocument();
  });

  it('shows text for no anime data', () => {
    (useAnimeDetails as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    });

    render(<AnimeDetailsComponent />);
    expect(screen.getByText('No details available.')).toBeInTheDocument();
  });

  it('removes details param when close button is clicked', () => {
    render(<AnimeDetailsComponent />);
    fireEvent.click(screen.getByRole('button', { name: '×' }));

    expect(mockSetSearchParams).toHaveBeenCalledTimes(1);
    const calledParams = mockSetSearchParams.mock.calls[0][0];
    expect(calledParams.has('details')).toBe(false);
  });
});
