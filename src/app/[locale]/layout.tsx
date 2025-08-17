import '@/styles/index.css';
import HeaderComponent from '@/components/header/header.component.tsx';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { routing } from '~/i18n/routing.ts';
import { notFound } from 'next/navigation';
import ClientProviders from '@/[locale]/client-providers.tsx';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hooks and routing',
  description: 'My App is a search anime list information',
};

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <body>
        <div id="root">
          <ClientProviders>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <HeaderComponent />
              {children}
            </NextIntlClientProvider>
          </ClientProviders>
        </div>
      </body>
    </html>
  );
}
