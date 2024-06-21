import { ReactNode } from 'react';
import { Inter as FontSans } from 'next/font/google';
import { ThemeProvider } from 'src/components/ThemeProvider';

import './globals.css';
import { cn } from 'src/lib/utils';
import { Button } from 'src/components/ui/Button';
import Link from 'next/link';
import { getSession } from '@auth0/nextjs-auth0';
import { BackButton } from './BackButton';

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

  return (
    <html lang='en' suppressHydrationWarning>
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
          {children}
          <BackButton className='absolute top-0 left-0' />
          {session && (
            <Button variant='link' asChild className='absolute top-0 right-0'>
              <Link href='/api/auth/logout'>Logout</Link>
            </Button>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
