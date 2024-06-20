import { MoviesList } from '../../components/MoviesList';
import { getPopularMovies, queryMovies } from '../lib/movies-service';

interface MoviesSearchProps {
  query: string;
}

export const MoviesSearch = async ({ query = '' }: MoviesSearchProps) => {
  const { results } = query
    ? await queryMovies({ query })
    : await getPopularMovies();

  return <MoviesList query={query} movies={results} />;
};
