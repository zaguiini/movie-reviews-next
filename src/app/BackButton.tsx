'use client';

import { useParams } from 'next/navigation';
import { Button } from 'src/components/ui/Button';
import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';

export const BackButton = ({ className }: { className: string }) => {
  const params = useParams();

  const previousPage = useMemo(() => {
    if (params.reviewId) {
      return {
        href: `/movies/${params.movieId}`,
        label: 'Movie',
      };
    }

    if (params.movieId) {
      return {
        href: '/',
        label: 'Home',
      };
    }

    return null;
  }, [params]);

  return previousPage ? (
    <Button variant='link' asChild className={className}>
      <Link href={previousPage.href}>
        <ArrowLeft /> {previousPage.label}
      </Link>
    </Button>
  ) : null;
};
