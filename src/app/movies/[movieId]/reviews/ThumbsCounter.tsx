'use client';

import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { Tooltip } from 'src/components/ui/Tooltip';
import { Button } from 'src/components/ui/Button';
import Pusher from 'pusher-js';
import useSWR from 'swr';
import { Rating } from 'src/app/db/ratings';
import { useEffect, useState } from 'react';
import { toggleRating } from './actions/toggle-rating';

interface ThumbsCounterProps {
  reviewId: number;
  isReadOnly: boolean;
  ratings: { positive: number; negative: number };
  myRating?: Rating['outcome'];
}

export const ThumbsCounter = ({
  reviewId,
  ratings: serverRatings,
  isReadOnly,
  myRating,
}: ThumbsCounterProps) => {
  const [shouldFetchData, enableDataFetching] = useState(false);
  const [ratings, setRatings] = useState(serverRatings);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
    });

    const channel = pusher.subscribe('rating-updates');

    channel.bind(reviewId.toString(), (data: typeof ratings) => {
      setRatings({
        positive: data.positive,
        negative: data.negative,
      });
    });

    return () => {
      channel.unbind(reviewId.toString());
      channel.unsubscribe();
    };
  }, [reviewId]);

  const hasRatings = ratings.positive > 0 || ratings.negative > 0;
  const { data: ratingsList, mutate } = useSWR<Rating[]>(
    shouldFetchData && hasRatings ? `/api/ratings/${reviewId}/list` : null
  );

  const ThumbsElement = isReadOnly ? 'div' : Button;

  async function dispatchToggleRating(outcome: Rating['outcome']) {
    await toggleRating({ reviewId, outcome });
    mutate();
  }

  const thumbsUpButton = (
    <ThumbsElement
      onMouseEnter={() => enableDataFetching(true)}
      className='flex gap-2 items-center'
      onClick={isReadOnly ? undefined : () => dispatchToggleRating('positive')}
    >
      <ThumbsUp
        size={16}
        fill={myRating === 'positive' ? 'currentColor' : 'none'}
      />
      {ratings.positive}
    </ThumbsElement>
  );

  const thumbsDownButton = (
    <ThumbsElement
      onMouseEnter={() => enableDataFetching(true)}
      className='flex gap-2 items-center'
      onClick={isReadOnly ? undefined : () => dispatchToggleRating('negative')}
    >
      <ThumbsDown
        size={16}
        fill={myRating === 'negative' ? 'currentColor' : 'none'}
      />
      {ratings.negative}
    </ThumbsElement>
  );

  return (
    <>
      {ratings.positive > 0 ? (
        <Tooltip
          trigger={thumbsUpButton}
          content={
            ratingsList
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
            ratingsList
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
