import { type ReactElement } from 'react';
import { render } from '@testing-library/react';
import { type InitialEntry, MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@/common/context/themeProvider.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function renderWithProviders(ui: ReactElement, initialEntries?: InitialEntry[]) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={initialEntries}>
        <ThemeProvider>{ui}</ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}
