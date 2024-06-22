'use client';

import { ReactNode } from 'react';
import { SWRConfig as SWRConfigProvider } from 'swr';

const fetcher = (url: string, init?: RequestInit) =>
  fetch(url, init).then((res) => res.json());

export const SWRConfig = ({ children }: { children: ReactNode }) => (
  <SWRConfigProvider value={{ fetcher }}>{children}</SWRConfigProvider>
);
