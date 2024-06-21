'use client';

import { ReactNode } from 'react';

export const LoginURL = ({ children }: { children: ReactNode }) => (
  <a
    href={`/api/auth/login?returnTo=${encodeURIComponent(location.href)}`}
    className='underline hover:no-underline'
  >
    {children}
  </a>
);
