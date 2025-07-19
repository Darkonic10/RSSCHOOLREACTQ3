import { render, screen } from '@testing-library/react';
import App from '@/App.tsx';
import { MemoryRouter } from 'react-router-dom';

test('App renders HeaderComponent', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  expect(screen.getByRole('textbox')).toBeInTheDocument();
});
