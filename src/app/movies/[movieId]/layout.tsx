import Image from 'next/image';
import { ReactNode } from 'react';
import { getMovieById } from 'src/app/lib/movies-service';
import { formatDate } from '../../../lib/format';

interface LayoutProps {
  children: ReactNode;
  params: { movieId: string };
}

export default async function Layout({ children, params }: LayoutProps) {
  const movieId = parseInt(params.movieId, 10);

  const movie = await getMovieById(movieId);

  return (
    <div className='w-full px-4 grid grid-areas-[cover_cover,details_content] gap-x-12 gap-y-6 grid-cols-[1fr,2fr]'>
      <header className='grid-in-[cover] aspect-[16/5] relative -mx-4'>
        {movie.backdrop_path && (
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={`Cover for ${movie.title}`}
            fill
            sizes='100%'
            style={{
              objectFit: 'cover',
            }}
          />
        )}
        <div className='absolute w-full left-0 bottom-0 p-4 pt-12 bg-gradient-to-t from-black'>
          <h1 className='text-4xl font-bold relative text-ellipsis overflow-hidden whitespace-nowrap'>
            {movie.title}
          </h1>
        </div>
      </header>
      <div className='grid-in-[details]'>
        <h2 className='text-2xl mb-2 font-bold'>Description</h2>
        <p>{movie.overview}</p>
        <p className='mt-4'>
          <span className='font-bold'>Release date</span>{' '}
          {movie.release_date ? formatDate(movie.release_date) : 'Unknown'}
        </p>
      </div>
      <div className='grid-in-[content]'>{children}</div>
    </div>
  );
}
