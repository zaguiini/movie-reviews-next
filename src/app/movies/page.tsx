import { getPopularMovies } from 'src/app/lib/movies-service';
import { MovieSearch } from 'src/components/MovieSearch';

export default async function MoviesList() {
  const { results } = await getPopularMovies();

  return (
    <div>
      <h1 className='text-3xl font-bold mb-6'>Movies list</h1>
      <MovieSearch movies={results} />
    </div>
  );
}
