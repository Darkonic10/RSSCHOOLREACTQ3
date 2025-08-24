import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { HomePage } from './home-page';
import { useFormStore } from '@/store/form-data';
import type { ModalProps } from '@/components/modal/modal.tsx';
import type { CardProps } from '@/components/card/card.tsx';

vi.mock('@/components/modal/modal.tsx', () => ({
  Modal: ({ children, onClose }: ModalProps) => (
    <div data-testid="modal">
      <button onClick={onClose}>Close</button>
      {children}
    </div>
  ),
}));

vi.mock('@/components/forms/uncontrolled-form', () => ({
  UncontrolledForm: ({ onSuccess }: { onSuccess: () => void }) => <button onClick={onSuccess}>Submit Uncontrolled</button>,
}));

vi.mock('@/components/forms/controlled-form', () => ({
  ControlledForm: ({ onSuccess }: { onSuccess: () => void }) => <button onClick={onSuccess}>Submit Controlled</button>,
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ data, className }: CardProps) => (
    <div data-testid="card" className={className}>
      {data.name}
    </div>
  ),
}));

describe('HomePage', () => {
  beforeEach(() => {
    useFormStore.setState({ data: [], countries: ['Russia'], setData: vi.fn() });
  });

  it('opens and closes Uncontrolled modal', async () => {
    render(<HomePage />);
    fireEvent.click(screen.getByText(/open uncontrolled/i));

    const modal = screen.getByTestId('modal');
    expect(modal).toBeInTheDocument();

    fireEvent.click(screen.getByText(/submit uncontrolled/i));
    await waitFor(() => {
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });
});