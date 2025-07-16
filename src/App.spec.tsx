import { fireEvent, render, screen } from '@testing-library/react';
import App from '@/App.tsx';
import { searchAnime } from '@/api/jikan.ts';
import { animeResponse } from '@/api/jikan.mock.ts';

vi.mock('./api/jikan', () => ({
  searchAnime: vi.fn(() => Promise.resolve(animeResponse)),
}));

describe('App component', () => {
  it('calls searchAnime and updates state via HeaderComponent', async () => {
    render(<App />);

    fireEvent.change(screen.getByPlaceholderText(/search by title/i), {
      target: { value: 'Naruto' },
    });
    fireEvent.submit(screen.getByTestId('headerForm'));

    await screen.findByText('Naruto');

    expect(searchAnime).toHaveBeenLastCalledWith('Naruto');
  });
});
