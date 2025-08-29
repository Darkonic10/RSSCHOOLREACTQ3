import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { type MyFormData, useFormStore } from '@/store/form-data';
import { getPasswordStrength } from '@/components/common/common';
import { UncontrolledForm } from '@/components/forms/uncontrolled-form.tsx';
import { formSchema } from '@/types/form.interface.ts';

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

vi.mock('@/types/form.interface.ts', () => ({
  formSchema: { safeParse: vi.fn() },
}));

const getErrorPAfterInput = (label: RegExp | string) => {
  const input = screen.getByLabelText(label, { selector: 'input' });
  const p = input.nextElementSibling as HTMLElement | null;
  if (!p) throw new Error('Error <p> not found after input');
  return p;
};

describe('UncontrolledForm', () => {
  const onSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all required fields', () => {
    render(<UncontrolledForm onSuccess={onSuccess} />);

    expect(screen.getByRole('textbox', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /age/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();

    expect(screen.getByLabelText(/^password$/i, { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByLabelText(/^confirm password$/i, { selector: 'input' })).toBeInTheDocument();

    expect(screen.getByRole('radio', { name: /^male$/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /^female$/i })).toBeInTheDocument();

    expect(screen.getByRole('checkbox', { name: /accept t&c/i })).toBeInTheDocument();

    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
  });

  it('shows validation errors when submitted empty (schema -> failure)', async () => {
    (formSchema.safeParse as Mock).mockReturnValueOnce({
      success: false,
      error: {
        issues: [
          { path: ['name'], message: 'Name is required' },
          { path: ['email'], message: 'Email is required' },
          { path: ['password'], message: 'Password is required' },
        ],
      },
    });

    render(<UncontrolledForm onSuccess={onSuccess} />);
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(getErrorPAfterInput(/name/i)).toHaveTextContent(/required/i);
      expect(getErrorPAfterInput(/email/i)).toHaveTextContent(/required/i);
      expect(getErrorPAfterInput(/^password$/i)).toHaveTextContent(/required/i);
    });

    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('updates password strength label when typing', () => {
    render(<UncontrolledForm onSuccess={onSuccess} />);
    const pwd = screen.getByLabelText(/^password$/i, { selector: 'input' });
    fireEvent.change(pwd, { target: { value: '12345' } });

    expect(getPasswordStrength).toHaveBeenCalledWith('12345');
    expect(screen.getByText(/weak/i)).toBeInTheDocument();
  });

  it('submits valid form and calls onSuccess (schema -> success)', async () => {
    const validData: MyFormData = {
      name: 'John',
      age: 30,
      email: 'john@test.com',
      password: 'P@ssw0rd',
      gender: 'male',
      country: 'Russia',
      agreement: true,
      file: null as unknown as File,
    };

    (formSchema.safeParse as Mock).mockReturnValueOnce({
      success: true,
      data: validData,
    });

    render(<UncontrolledForm onSuccess={onSuccess} />);

    fireEvent.change(screen.getByRole('textbox', { name: /name/i }), { target: { value: 'John' } });
    fireEvent.change(screen.getByRole('spinbutton', { name: /age/i }), { target: { value: '30' } });
    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), { target: { value: 'john@test.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i, { selector: 'input' }), { target: { value: 'P@ssw0rd' } });
    fireEvent.change(screen.getByLabelText(/^confirm password$/i, { selector: 'input' }), {
      target: { value: 'P@ssw0rd' },
    });

    fireEvent.click(screen.getByRole('radio', { name: /^male$/i }));
    fireEvent.click(screen.getByRole('checkbox', { name: /accept t&c/i }));

    fireEvent.change(screen.getByLabelText(/country/i), { target: { value: 'Russia' } });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it('clears previous errors after a successful re-submit', async () => {
    (formSchema.safeParse as Mock)
      .mockReturnValueOnce({
        success: false,
        error: {
          issues: [{ path: ['name'], message: 'Name is required' }],
        },
      })
      .mockReturnValueOnce({
        success: true,
        data: {
          name: 'Valid Name',
          age: 22,
          email: 'valid@test.com',
          password: 'P@ss1234',
          gender: 'male',
          country: 'Russia',
          agreement: true,
          file: null as unknown as File,
        } as MyFormData,
      });

    render(<UncontrolledForm onSuccess={onSuccess} />);

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      expect(getErrorPAfterInput(/name/i)).toHaveTextContent(/required/i);
    });

    fireEvent.change(screen.getByRole('textbox', { name: /name/i }), { target: { value: 'Valid Name' } });
    fireEvent.change(screen.getByRole('spinbutton', { name: /age/i }), { target: { value: '22' } });
    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), { target: { value: 'valid@test.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i, { selector: 'input' }), { target: { value: 'P@ss1234' } });
    fireEvent.change(screen.getByLabelText(/^confirm password$/i, { selector: 'input' }), {
      target: { value: 'P@ss123' },
    });
    fireEvent.click(screen.getByRole('radio', { name: /^male$/i }));
    fireEvent.click(screen.getByRole('checkbox', { name: /accept t&c/i }));
    fireEvent.change(screen.getByLabelText(/country/i), { target: { value: 'Russia' } });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });
});