const API_BASE_URL = 'https://api.themoviedb.org/3';

const authenticatedRequest = (url: string) =>
  fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    },
  }).then((response) => response.json());

export interface Movie {
  id: number;
  title: string;
  backdrop_path: string;
  poster_path: string;
  release_date: string;
}

export const getPopularMovies = (): Promise<{
  page: number;
  results: Movie[];
}> => authenticatedRequest(`${API_BASE_URL}/discover/movie`);

interface QueryMoviesParams {
  query: string;
}

export const queryMovies = ({ query }: QueryMoviesParams) => {
  const url = new URL(`${API_BASE_URL}/search/movie`);
  url.searchParams.append('query', query);

  return authenticatedRequest(url.toString());
};
