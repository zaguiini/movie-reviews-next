import { ReactNode } from 'react';
import { Inter as FontSans } from 'next/font/google';
import { ThemeProvider } from 'src/components/ThemeProvider';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import './globals.css';
import { cn } from 'src/lib/utils';
import { getSession } from '@auth0/nextjs-auth0';
import { BackButton } from './BackButton';
import { SWRConfig } from './SWRConfig';
import { UserSettings } from './UserSettings';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  const locale = await getLocale();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <SWRConfig>
            <NextIntlClientProvider messages={messages}>
              {children}
            </NextIntlClientProvider>
          </SWRConfig>
          <BackButton className='absolute top-0 left-0' />
          {session && <UserSettings />}
        </ThemeProvider>
      </body>
    </html>
  );
}
