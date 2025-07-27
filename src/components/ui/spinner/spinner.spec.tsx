import { render } from '@testing-library/react';
import Spinner from '@/components/ui/spinner/spinner.tsx';

describe('Spinner', () => {
  it('should render spinner with expected structure', () => {
    const { container, getByTestId } = render(<Spinner />);
    expect(getByTestId('spinner-container')).toBeInTheDocument();
    expect(getByTestId('spinner')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
