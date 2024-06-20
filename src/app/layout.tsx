import { ReactNode } from 'react';
import { Inter as FontSans } from 'next/font/google';
import { ThemeProvider } from 'src/components/ThemeProvider';

import './globals.css';
import { cn } from 'src/lib/utils';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
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
          <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
