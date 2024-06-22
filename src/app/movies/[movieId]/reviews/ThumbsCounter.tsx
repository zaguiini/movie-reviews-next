'use client';

import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { createElement } from 'react';
import { Tooltip } from 'src/components/ui/Tooltip';
import { Button } from 'src/components/ui/Button';

interface ThumbsCounterProps {
  isReadOnly: boolean;
  up: {
    total: number;
    users: string[];
  };
  down: {
    total: number;
    users: string[];
  };
}

const noop = () => {};

export const ThumbsCounter = ({ up, down, isReadOnly }: ThumbsCounterProps) => {
  const thumbsUpButton = createElement(
    isReadOnly ? 'div' : Button,
    {
      className: 'flex gap-2 items-center',
      onClick: isReadOnly ? undefined : noop,
    },
    <ThumbsUp size={16} />,
    up.total
  );

  const thumbsDownButton = createElement(
    isReadOnly ? 'div' : Button,
    {
      className: 'flex gap-2 items-center',
      onClick: isReadOnly ? undefined : noop,
    },
    <ThumbsDown size={16} />,
    down.total
  );

  return (
    <>
      {up.users.length > 0 ? (
        <Tooltip trigger={thumbsUpButton} content={up.users.join(', ')} />
      ) : (
        thumbsUpButton
      )}
      {down.users.length > 0 ? (
        <Tooltip trigger={thumbsDownButton} content={down.users.join(', ')} />
      ) : (
        thumbsDownButton
      )}
    </>
  );
};
