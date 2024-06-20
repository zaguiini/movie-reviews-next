import { Search } from 'lucide-react';
import * as React from 'react';

import { Input, InputProps } from './Input';

export const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    return (
      <div className='relative flex-1 md:grow-0'>
        <Search className='absolute left-2.5 top-3 h-4 w-4 text-muted-foreground' />
        <Input
          className='w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]'
          ref={ref}
          {...props}
          type='search'
        />
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
