import { render, screen } from '@testing-library/react';
import AboutPageComponent from '@/pages/about-page/about-page.component.tsx';

describe('AboutPageComponent', () => {
  it('renders the heading', () => {
    render(<AboutPageComponent />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('About This Application');
  });

  it('renders the author paragraph', () => {
    render(<AboutPageComponent />);
    expect(screen.getByText(/Author: Дмитрий \(Darkonic10\)/i)).toBeInTheDocument();
  });

  it('renders the link with correct href and text', () => {
    render(<AboutPageComponent />);
    const link = screen.getByRole('link', { name: /RS School React course/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
  });
});
