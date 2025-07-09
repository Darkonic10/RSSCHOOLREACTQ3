import { describe, it, expect, vi } from 'vitest';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomButton from './custom-button';
import ErrorBoundary from '@/components/error-boundary/error-boundary.component.tsx';

describe('Custom Button', () => {
  it('renders with children', () => {
    render(<CustomButton>Click me</CustomButton>);
    expect(screen.getByTestId('custom-button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked (no error)', async () => {
    const handleClick = vi.fn();
    render(<CustomButton onClick={handleClick}>Click</CustomButton>);

    await userEvent.click(screen.getByTestId('custom-button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('catch error and show fallback UI if isNeedError', async () => {
    render(
      <ErrorBoundary>
        <CustomButton isNeedError={true}>Trigger Error</CustomButton>
      </ErrorBoundary>,
    );

    await userEvent.click(screen.getByTestId('custom-button'));

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.getByText('💣 Simulated error in render after click!')).toBeInTheDocument();
  });
});
