import { render, screen } from '@testing-library/react';
import App from '@/App.tsx';
import { HomePage } from '@/pages/home-page/home-page.tsx';

vi.mock('@/pages/home-page/home-page.tsx', () => ({
  HomePage: vi.fn(() => <div data-testid="home-page">Home Page</div>),
}));

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('renders HomePage component', () => {
    render(<App />);
    expect(HomePage).toHaveBeenCalled();
  });
});