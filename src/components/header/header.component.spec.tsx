import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import HeaderComponent from './header.component.tsx';
import { MemoryRouter } from 'react-router-dom';
import * as routerDom from 'react-router-dom';

const setSearchParamsMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof routerDom>('react-router-dom');
  return {
    ...actual,
    useSearchParams: () => [new URLSearchParams(), setSearchParamsMock],
  };
});

describe('HeaderComponent', () => {
  beforeEach(() => {
    localStorage.clear();
    setSearchParamsMock.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input and search button', () => {
    render(
      <MemoryRouter>
        <HeaderComponent />
      </MemoryRouter>,
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('loads saved search from localStorage on mount', async () => {
    localStorage.setItem('lastSearch', JSON.stringify('Naruto'));

    render(
      <MemoryRouter>
        <HeaderComponent />
      </MemoryRouter>,
    );

    const input = await screen.findByRole('textbox');

    await waitFor(() => {
      expect(input).toHaveValue('Naruto');
    });

    fireEvent.submit(screen.getByTestId('headerForm'));

    await waitFor(() => {
      expect(setSearchParamsMock).toHaveBeenCalled();
      const paramsPassed = setSearchParamsMock.mock.calls[0][0];
      expect(paramsPassed.get('q')).toBe('Naruto');
    });
  });

  it('shows empty input if no saved search in localStorage', () => {
    render(
      <MemoryRouter>
        <HeaderComponent />
      </MemoryRouter>,
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('');
    expect(setSearchParamsMock).not.toHaveBeenCalled();
  });

  it('updates input trimmed value on change', () => {
    render(
      <MemoryRouter>
        <HeaderComponent />
      </MemoryRouter>,
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'One Piece   ' } });

    expect(input).toHaveValue('One Piece');
  });

  it('saves trimmed search and calls setSearchParams on submit', () => {
    render(
      <MemoryRouter>
        <HeaderComponent />
      </MemoryRouter>,
    );

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: '  Bleach  ' } });
    fireEvent.click(button);

    expect(JSON.parse(localStorage.getItem('lastSearch') ?? '""')).toBe('Bleach');
    expect(setSearchParamsMock).toHaveBeenCalled();

    const paramsPassed = setSearchParamsMock.mock.calls[0][0];
    expect(paramsPassed.get('q')).toBe('Bleach');
    expect(paramsPassed.get('page')).toBe('1');
  });

  it('overwrites previous localStorage value on new search', () => {
    localStorage.setItem('lastSearch', JSON.stringify('OldTerm'));
    render(
      <MemoryRouter>
        <HeaderComponent />
      </MemoryRouter>,
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'NewTerm' } });
    fireEvent.submit(screen.getByTestId('headerForm'));

    expect(JSON.parse(localStorage.getItem('lastSearch') ?? '""')).toBe('NewTerm');
    expect(setSearchParamsMock).toHaveBeenCalled();

    const paramsPassed = setSearchParamsMock.mock.calls[0][0];
    expect(paramsPassed.get('q')).toBe('NewTerm');
    expect(paramsPassed.get('page')).toBe('1');
  });
});
