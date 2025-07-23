import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { router as appRouter } from './router';
import { render, waitFor, screen } from '@testing-library/react';
import React from 'react';

vi.mock('@/pages/home-page/home-page.component.tsx', () => ({
  default: () => <div>Home Page</div>,
}));
vi.mock('@/pages/about-page/about-page.component.tsx', () => ({
  default: () => <div>About Page</div>,
}));
vi.mock('@/pages/404-page/404-page.component.tsx', () => ({
  default: () => <div>404 Not Found</div>,
}));
vi.mock('@/pages/home-page/home-page.loader.ts', () => ({
  homePageLoader: () => Promise.resolve({}),
}));

vi.mock('@/components/error-boundary/error-boundary.component.tsx', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock('@/components/header/header.component.tsx', () => ({
  default: () => <div>Header</div>,
}));

describe('App Router', () => {
  it('renders HomePageComponent at /', async () => {
    const router = createMemoryRouter(appRouter.routes, {
      initialEntries: ['/'],
    });

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });
  });

  it('renders AboutPageComponent at /about', async () => {
    const router = createMemoryRouter(appRouter.routes, {
      initialEntries: ['/about'],
    });

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText('About Page')).toBeInTheDocument();
    });
  });

  it('renders NotFoundPage at unknown path', async () => {
    const router = createMemoryRouter(appRouter.routes, {
      initialEntries: ['/unknown'],
    });

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText('404 Not Found')).toBeInTheDocument();
    });
  });
});
