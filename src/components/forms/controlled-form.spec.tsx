import { beforeEach, describe, expect, vi } from 'vitest';
import { ControlledForm } from '@/components/forms/controlled-form';
import { fireEvent, render, screen } from '@testing-library/react';
import { getPasswordStrength } from '@/components/common/common.ts';
import { useFormStore } from '@/store/form-data.ts';
import type { AutocompleteProps } from '@/components/ui/autocomplete/autocomplete.tsx';

type StoreState = ReturnType<typeof useFormStore.getState>;

vi.mock('@/store/form-data', () => {
  const mockState: StoreState = {
    countries: ['Russia', 'Belarus', 'Kazakhstan'],
    data: [],
    setData: vi.fn(),
  };

  return {
    useFormStore: (selector: (s: StoreState) => unknown) => selector(mockState),
  };
});

vi.mock('@/components/common/common', () => ({
  getPasswordStrength: vi.fn().mockReturnValue({ label: 'Weak', color: 'red' }),
}));

vi.mock('@/components/ui/autocomplete/autocomplete.tsx', () => ({
  Autocomplete: ({ id, label, value, onChange }: AutocompleteProps) => (
    <input id={id} aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} />
  ),
}));

describe('ControlledForm', () => {
  const onSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all required fields', () => {
    render(<ControlledForm onSuccess={onSuccess} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/^male$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^female$/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/accept t&c/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
  });

  it('updates password strength on change', () => {
    render(<ControlledForm onSuccess={onSuccess} />);
    const passwordInput = screen.getByLabelText(/^password$/i);
    fireEvent.change(passwordInput, { target: { value: '12345' } });

    expect(getPasswordStrength).toHaveBeenCalledWith('12345');
    expect(screen.getByText(/weak/i)).toBeInTheDocument();
  });
});