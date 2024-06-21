'use client';

import { useParams } from 'next/navigation';
import { Button } from 'src/components/ui/Button';
import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';

export const BackButton = ({ className }: { className: string }) => {
  const params = useParams();

  const href = useMemo(() => {
    if (params.reviewId) {
      return `/movies/${params.movieId}`;
    }

    if (params.movieId) {
      return '/';
    }

    return null;
  }, [params]);

  return href ? (
    <Button variant='link' asChild className={className}>
      <Link href={href}>
        <ArrowLeft /> Go back
      </Link>
    </Button>
  ) : null;
};
