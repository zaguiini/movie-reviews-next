import { MoviesSearch } from './movies/MoviesSearch';
import { getUser } from './lib/auth';
import { getReviewsByOwner } from './db/reviews';
import { ReviewCard } from 'src/components/ReviewCard';
import { getMovieById } from './lib/movies-service';

export async function Dashboard({ query = '' }) {
  const user = await getUser();

  const reviews = await getReviewsByOwner(user.email);
  const moviesForReviews = await Promise.all(
    reviews.map((review) => getMovieById(review.movieId))
  );

  return (
    <div className='flex flex-col gap-10'>
      <h2 className='text-3xl font-bold tracking-tight'>Hello, {user.name}!</h2>
      {reviews.length > 0 ? (
        <div className='flex flex-col gap-8'>
          <div>
            <h2 className='text-xl font-bold mb-6'>My reviews</h2>
            <ul className='grid grid-cols-2 gap-2'>
              {reviews.map((review, index) => (
                <li key={review.id}>
                  <ReviewCard movie={moviesForReviews[index]} review={review} />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className='text-xl font-bold mb-6'>Search movies</h2>
            <MoviesSearch query={query} />
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
