import { fireEvent, render, screen } from '@testing-library/react';
import HeaderComponent from './header.component.tsx';

describe('HeaderComponent', () => {
  let onSearchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onSearchMock = vi.fn();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders search input and search button', () => {
    render(<HeaderComponent onSearch={onSearchMock} />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('loads saved search from localStorage on mount', () => {
    localStorage.setItem('lastSearch', 'Naruto');
    render(<HeaderComponent onSearch={onSearchMock} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('Naruto');
    expect(onSearchMock).toHaveBeenCalledWith('Naruto');
  });

  it('shows empty input if no saved search in localStorage', () => {
    render(<HeaderComponent onSearch={onSearchMock} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('');
    expect(onSearchMock).toHaveBeenCalledWith('');
  });

  it('updates input trimmed value on change', () => {
    render(<HeaderComponent onSearch={onSearchMock} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'One Piece   ' } });

    expect(input.value).toBe('One Piece');
  });

  it('saves trimmed search and calls onSearch on submit', () => {
    render(<HeaderComponent onSearch={onSearchMock} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: '  Bleach  ' } });
    fireEvent.click(button);

    expect(localStorage.getItem('lastSearch')).toBe('Bleach');
    expect(onSearchMock).toHaveBeenCalledWith('Bleach');
  });

  it('overwrites previous localStorage value on new search', () => {
    localStorage.setItem('lastSearch', 'OldTerm');
    render(<HeaderComponent onSearch={onSearchMock} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'NewTerm' } });
    fireEvent.submit(screen.getByTestId('headerForm'));

    expect(localStorage.getItem('lastSearch')).toBe('NewTerm');
    expect(onSearchMock).toHaveBeenCalledWith('NewTerm');
  });
});
