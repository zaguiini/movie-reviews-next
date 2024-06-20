import { SearchInput } from './ui/SearchInput';
import Link from 'next/link';
import type { Movie } from 'src/app/lib/movies-service';
import Image from 'next/image';

export const MovieDetails = ({ movie }: { movie: Movie }) => {
  return (
    <div className='flex flex-col w-full relative' title={movie.title}>
      <div className='w-full aspect-[9/15] relative'>
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
          alt={`Cover for ${movie.title}`}
          fill
          style={{
            objectFit: 'cover',
          }}
        />
      </div>
      <div className='absolute w-full left-0 bottom-0 p-3 pt-10 bg-gradient-to-t from-black'>
        <p className='relative text-ellipsis overflow-hidden whitespace-nowrap'>
          ({movie.release_date.split('-')[0]}) {movie.title}
        </p>
      </div>
    </div>
  );
};

export const MovieSearch = ({ movies }: { movies: Movie[] }) => {
  return (
    <div className='flex flex-col gap-6'>
      <SearchInput placeholder='Search for a movie...' />
      <ul className='group grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4'>
        {movies.map((movie) => (
          <Link
            className='transition group-hover:opacity-50 hover:!opacity-100'
            key={movie.id}
            href={`/movies/${movie.id}`}
          >
            <MovieDetails movie={movie} />
          </Link>
        ))}
      </ul>
    </div>
  );
};
