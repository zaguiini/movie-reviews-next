'use client';

import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { createElement } from 'react';
import { Tooltip } from 'src/components/ui/Tooltip';
import { Button } from 'src/components/ui/Button';

interface ThumbsCounterProps {
  isReadOnly: boolean;
  ratings: { positive: number; negative: number };
}

const noop = () => {};

export const ThumbsCounter = ({ ratings, isReadOnly }: ThumbsCounterProps) => {
  const thumbsUpButton = createElement(
    isReadOnly ? 'div' : Button,
    {
      className: 'flex gap-2 items-center',
      onClick: isReadOnly ? undefined : noop,
    },
    <ThumbsUp size={16} />,
    ratings.positive
  );

  const thumbsDownButton = createElement(
    isReadOnly ? 'div' : Button,
    {
      className: 'flex gap-2 items-center',
      onClick: isReadOnly ? undefined : noop,
    },
    <ThumbsDown size={16} />,
    ratings.negative
  );

  return (
    <>
      {ratings.positive > 0 ? (
        <Tooltip trigger={thumbsUpButton} content={[].join(', ')} />
      ) : (
        thumbsUpButton
      )}
      {ratings.negative > 0 ? (
        <Tooltip trigger={thumbsDownButton} content={[].join(', ')} />
      ) : (
        thumbsDownButton
      )}
    </>
  );
};
