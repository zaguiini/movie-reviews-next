import { MoviesSearch } from './movies/MoviesSearch';
import { getUser } from './lib/auth';

export async function Dashboard({ query = '' }) {
  const user = await getUser();

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-1 items-center justify-between'>
        <h2 className='text-3xl font-bold tracking-tight'>
          Hello, {user.name}!
        </h2>
        <a href='/api/auth/logout'>Logout</a>
      </div>
      <div className='flex flex-col justify-start'>
        <h2 className='text-xl font-bold'>Welcome to Movie Reviews!</h2>
        <p>
          Search for a movie below to start reviewing and reacting to other
          people&apos;s reviews.
        </p>
        <div className='mt-6'>
          <MoviesSearch query={query} />
        </div>
      </div>
    </div>
  );
}
