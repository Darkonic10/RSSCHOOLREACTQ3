import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AnimeDetailsComponent from './anime-details.component';
import * as api from '@/api/jikan';
import * as router from 'react-router-dom';

vi.mock('@/api/jikan', () => ({
  getAnimeById: vi.fn(),
}));

const mockSetSearchParams = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof router>('react-router-dom');
  return {
    ...actual,
    useSearchParams: vi.fn(() => [new URLSearchParams('details=1'), mockSetSearchParams]),
    useLoaderData: vi.fn(() => ({
      searchResults: {
        data: [
          {
            mal_id: 1,
            titles: [{ title: 'Test Anime' }],
            images: { jpg: { image_url: 'test.jpg' } },
            synopsis: 'Test synopsis',
          },
        ],
      },
    })),
  };
});

describe('AnimeDetailsComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders anime data from searchResults', async () => {
    render(<AnimeDetailsComponent />);

    expect(await screen.findByRole('heading', { level: 2 })).toHaveTextContent('Test Anime');
    expect(screen.getByAltText('Test Anime')).toHaveAttribute('src', 'test.jpg');
    expect(screen.getByText('Test synopsis')).toBeInTheDocument();
  });

  it('calls getAnimeById if anime is not in searchResults', async () => {
    (router.useSearchParams as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      new URLSearchParams('details=2'),
      mockSetSearchParams,
    ]);

    (api.getAnimeById as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        mal_id: 2,
        titles: [{ title: 'Fetched Anime' }],
        images: { jpg: { image_url: 'fetched.jpg' } },
        synopsis: 'Fetched synopsis',
      },
    });

    render(<AnimeDetailsComponent />);

    await waitFor(() => {
      expect(api.getAnimeById).toHaveBeenCalledWith('2');
    });

    expect(await screen.findByRole('heading', { level: 2 })).toHaveTextContent('Fetched Anime');
    expect(screen.getByAltText('Fetched Anime')).toHaveAttribute('src', 'fetched.jpg');
    expect(screen.getByText('Fetched synopsis')).toBeInTheDocument();
  });

  it('shows Spinner if loading or no anime data', () => {
    (router.useLoaderData as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ searchResults: { data: [] } });

    render(<AnimeDetailsComponent />);
    expect(screen.getByTestId('spinner-container')).toBeInTheDocument();
  });

  it('removes details param when close button is clicked', () => {
    render(<AnimeDetailsComponent />);
    fireEvent.click(screen.getByRole('button', { name: '×' }));

    expect(mockSetSearchParams).toHaveBeenCalledTimes(1);
    const calledParams = mockSetSearchParams.mock.calls[0][0];
    expect(calledParams.has('details')).toBe(false);
  });
});
