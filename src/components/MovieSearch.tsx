import { ChevronRight } from 'lucide-react';
import { SearchInput } from './ui/SearchInput';
import Link from 'next/link';
import type { Movie } from 'src/app/lib/movies-service';

export const MovieSearch = ({ movies }: { movies: Movie[] }) => {
  return (
    <div className='flex flex-col gap-6'>
      <SearchInput placeholder='Search for a movie...' />
      <ul>
        {movies.map((movie) => (
          <Link
            key={movie.id}
            href={`/movies/${movie.id}`}
            className='flex gap-2 items-center'
          >
            <ChevronRight className='w-4' />
            {movie.title} ({movie.release_date.split('-')[0]})
          </Link>
        ))}
      </ul>
    </div>
  );
};
