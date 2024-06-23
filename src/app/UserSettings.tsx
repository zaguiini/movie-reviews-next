'use client';

import { Button } from 'src/components/ui/Button';
import Link from 'next/link';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from 'src/components/ui/HoverCard';
import { Globe } from 'lucide-react';
import { setLocale } from '../i18n';

const languages = [
  { id: 'en', label: '🇬🇧' },
  { id: 'pt', label: '🇧🇷' },
];

export const UserSettings = () => {
  return (
    <div className='absolute top-0 right-0 flex gap-2 items-center'>
      <HoverCard>
        <HoverCardTrigger>
          <Globe size={22} />
        </HoverCardTrigger>
        <HoverCardContent className='flex flex-col gap-2 w-fit'>
          {languages.map(({ id, label }) => (
            <Button
              variant='ghost'
              size='icon'
              key={id}
              onClick={() => setLocale(id)}
            >
              {label}
            </Button>
          ))}
        </HoverCardContent>
      </HoverCard>
      <Button variant='link' asChild>
        <Link href='/api/auth/logout'>Logout</Link>
      </Button>
    </div>
  );
};
