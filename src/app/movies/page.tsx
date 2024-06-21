import { MoviesSearch } from './MoviesSearch';

export default async function MoviesList({ searchParams: { query = '' } }) {
  return (
    <div className='px-4 py-6'>
      <h1 className='text-3xl font-bold mb-6'>Movies list</h1>
      <MoviesSearch query={query} />
    </div>
  );
}
