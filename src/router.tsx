import { createBrowserRouter } from 'react-router-dom';
import HomePageComponent from '@/pages/home-page/home-page.component.tsx';
import { homePageLoader } from '@/pages/home-page/home-page.loader.ts';
import App from '@/App.tsx';
import AboutPageComponent from '@/pages/about-page/about-page.component.tsx';
import NotFoundPage from '@/pages/404-page/404-page.component.tsx';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        {
          index: true,
          element: <HomePageComponent />,
          loader: homePageLoader,
          shouldRevalidate: ({ currentUrl, nextUrl }) => {
            const curr = new URLSearchParams(currentUrl.search);
            const next = new URLSearchParams(nextUrl.search);

            return curr.get('q') !== next.get('q') || curr.get('page') !== next.get('page');
          },
        },
        {
          path: 'about',
          element: <AboutPageComponent />,
        },
        {
          path: '*',
          element: <NotFoundPage />,
        },
      ],
    },
  ],
  {
    basename: process.env.NODE_ENV === 'production' ? '/RSSCHOOLREACTQ3/' : '',
  },
);
