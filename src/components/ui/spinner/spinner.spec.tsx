import { render, screen } from '@testing-library/react';
import Spinner from '@/components/ui/spinner/spinner.tsx';

describe('Spinner', () => {
  it('should render spinner container', () => {
    render(<Spinner />);
    const container = screen.getByTestId('spinner-container');
    expect(container).toBeInTheDocument();
  });

  it('should render spinning element', () => {
    render(<Spinner />);
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
  });
});
