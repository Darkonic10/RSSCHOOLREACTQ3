vi.mock('colorthief', () => {
  return {
    default: class ColorThief {
      getPalette() {
        return [
          [255, 0, 0],
          [0, 255, 0],
          [0, 0, 255],
          [255, 255, 0],
        ];
      }
    },
  };
});

vi.mock('@/common/common.ts', () => {
  return {
    generateRadialGradient: vi.fn(() => 'mocked-gradient'),
  };
});

import { cleanup, render, screen, act, fireEvent } from '@testing-library/react';
import AnimeCard from '@/components/ui/anime-card/anime-card.tsx';
import { generateRadialGradient } from '@/common/common.ts';
import { animeMock, animeMockMinimal } from '@/api/jikan.mock.ts';

describe('AnimeCard', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders correctly with complete data', () => {
    render(<AnimeCard anime={animeMock} />);
    expect(screen.getByText('★ 8.7')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', animeMock.images.jpg.image_url);
    expect(screen.getByText('Naruto')).toBeInTheDocument();
    const labelEpisodes = screen.getByText('Episodes:');
    expect(labelEpisodes.closest('p')).toHaveTextContent('Episodes: 220');
    const labelSource = screen.getByText('Source:');
    expect(labelSource.closest('p')).toHaveTextContent('Source: Manga');
    const labelStatus = screen.getByText('Status:');
    expect(labelStatus.closest('p')).toHaveTextContent('Status: Finished Airing');
  });

  it('gracefully handles missing fields', () => {
    render(<AnimeCard anime={animeMockMinimal} />);
    expect(screen.getByText('★ N/A')).toBeInTheDocument();
    expect(screen.getByText('Untitled')).toBeInTheDocument();
    const labelEpisodes = screen.getByText('Episodes:');
    expect(labelEpisodes.closest('p')).toHaveTextContent('Episodes: Unknown');
    const labelSource = screen.getByText('Source:');
    expect(labelSource.closest('p')).toHaveTextContent('Source: Unknown');
    const labelStatus = screen.getByText('Status:');
    expect(labelStatus.closest('p')).toHaveTextContent('Status: Unknown');
  });

  it('calls generateRadialGradient', async () => {
    render(<AnimeCard anime={animeMock} />);
    const img = screen.getByRole('img');
    await act(async () => {
      fireEvent.load(img);

      await new Promise((r) => setTimeout(r, 0));
    });

    expect(generateRadialGradient).toHaveBeenCalled();
  });
});
