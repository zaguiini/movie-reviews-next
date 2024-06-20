import { ChevronRight } from 'lucide-react';
import { SearchInput } from './ui/SearchInput';
import Link from 'next/link';

const movies = [
  {
    id: 1,
    title: 'Gone with the wind',
    release_date: '1951',
  },
  {
    id: 2,
    title: 'Back with the wind',
    release_date: '2024',
  },
];

export const MovieSearch = () => {
  return (
    <div className='flex flex-col gap-10'>
      <SearchInput placeholder='Search for a movie...' />
      <ul>
        {movies.map((movie) => (
          <Link
            key={movie.id}
            href={`/movies/${movie.id}`}
            className='flex gap-2 items-center'
          >
            <ChevronRight className='w-4' />
            {movie.title} ({movie.release_date})
          </Link>
        ))}
      </ul>
    </div>
  );
};
