'use client';

import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { Tooltip } from 'src/components/ui/Tooltip';
import { Button } from 'src/components/ui/Button';
import useSWR from 'swr';
import { Rating } from 'src/app/db/ratings';
import { useState } from 'react';

interface ThumbsCounterProps {
  reviewId: number;
  isReadOnly: boolean;
  ratings: { positive: number; negative: number };
}

const noop = () => {};

export const ThumbsCounter = ({
  reviewId,
  ratings,
  isReadOnly,
}: ThumbsCounterProps) => {
  const [shouldFetchData, enableDataFetching] = useState(false);
  const hasRatings = ratings.positive > 0 || ratings.negative > 0;
  const { data } = useSWR<Rating[]>(
    shouldFetchData && hasRatings ? `/api/ratings/${reviewId}` : null
  );

  const ThumbsElement = isReadOnly ? 'div' : Button;

  const thumbsUpButton = (
    <ThumbsElement
      onMouseEnter={() => enableDataFetching(true)}
      className='flex gap-2 items-center'
      onClick={isReadOnly ? undefined : noop}
    >
      <ThumbsUp size={16} />
      {ratings.positive}
    </ThumbsElement>
  );

  const thumbsDownButton = (
    <ThumbsElement
      onMouseEnter={() => enableDataFetching(true)}
      className='flex gap-2 items-center'
      onClick={isReadOnly ? undefined : noop}
    >
      <ThumbsDown size={16} />
      {ratings.negative}
    </ThumbsElement>
  );

  return (
    <>
      {ratings.positive > 0 ? (
        <Tooltip
          trigger={thumbsUpButton}
          content={
            data
              ?.filter(({ outcome }) => outcome === 'positive')
              .map(({ owner }) => owner)
              .join(', ') ?? 'Loading...'
          }
        />
      ) : (
        thumbsUpButton
      )}
      {ratings.negative > 0 ? (
        <Tooltip
          trigger={thumbsDownButton}
          content={
            data
              ?.filter(({ outcome }) => outcome === 'negative')
              .map(({ owner }) => owner)
              .join(', ') ?? 'Loading...'
          }
        />
      ) : (
        thumbsDownButton
      )}
    </>
  );
};
