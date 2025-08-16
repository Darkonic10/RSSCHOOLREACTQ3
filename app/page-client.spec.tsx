import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/common/test-utils.tsx';
import App from 'next/app';

test('App renders HeaderComponent', () => {
  renderWithProviders(<App />);
  expect(screen.getByRole('textbox')).toBeInTheDocument();
});
