import { fireEvent, render, screen } from '@testing-library/react';
import CustomInput from '@/components/ui/custom-input/custom-input.tsx';

describe('Custom Input', () => {
  it('should render', () => {
    render(<CustomInput />);
    const input = screen.getByTestId('custom-input');
    expect(input).toBeInTheDocument();
  });

  it('should call onChange when typed', () => {
    const handleChange = vi.fn();
    render(<CustomInput value="" onChange={handleChange} />);
    const input = screen.getByTestId('custom-input');

    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('should render input with provided value', () => {
    render(<CustomInput value="Test value" />);
    const input = screen.getByDisplayValue('Test value');
    expect(input).toBeInTheDocument();
  });
});
