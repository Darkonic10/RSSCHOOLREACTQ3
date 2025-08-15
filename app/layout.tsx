'use client';

import '@/styles/index.css';
import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/common/context/themeProvider.tsx';
import HeaderComponent from '@/components/header/header.component.tsx';
import ErrorBoundary from '@/components/error-boundary/error-boundary.component.tsx';

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Hooks and routing</title>
      </head>
      <body>
        <div id="root">
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <ErrorBoundary>
                <HeaderComponent />
                {children}
              </ErrorBoundary>
            </ThemeProvider>
          </QueryClientProvider>
        </div>
      </body>
    </html>
  );
}
