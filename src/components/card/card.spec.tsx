import { render, screen } from '@testing-library/react';
import type { MyFormData } from '@/store/form-data.ts';
import { Card } from '@/components/card/card.tsx';

vi.stubGlobal('URL', {
  createObjectURL: vi.fn().mockReturnValue('mocked-url'),
});

describe('Card', () => {
  const data: MyFormData = {
    name: 'John',
    age: 30,
    email: 'john@test.com',
    password: 'P@ss1234',
    gender: 'male',
    country: 'Russia',
    agreement: true,
    file: new File(['dummy'], 'dummy.png', { type: 'image/png' }),
  };

  it('renders all data correctly', () => {
    render(<Card data={data} />);

    expect(screen.getByText(/Name: John/i)).toBeInTheDocument();
    expect(screen.getByText(/Age: 30/i)).toBeInTheDocument();
    expect(screen.getByText(/Email: john@test.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Password: P@ss1234/i)).toBeInTheDocument();
    expect(screen.getByText(/Gender: male/i)).toBeInTheDocument();
    expect(screen.getByText(/Country: Russia/i)).toBeInTheDocument();
    expect(screen.getByText(/Accept T&C: Accepted/i)).toBeInTheDocument();

    const img = screen.getByAltText(/Preview/i) as HTMLImageElement;
    expect(img.src).toContain('mocked-url');
  });

  it('applies additional className if provided', () => {
    render(<Card data={data} className="extra-class" />);
    const card = screen.getByText(/Name: John/i).closest('div');
    expect(card).toHaveClass('extra-class');
  });
});