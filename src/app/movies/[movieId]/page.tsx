import Image from 'next/image';
import { getMovieById } from 'src/app/lib/movies-service';
import { WriteReviewForm } from './WriteReviewForm';
import { Review, getReviews } from 'src/app/db/reviews';
import { getPotentialUser } from 'src/app/lib/auth';
import { ReviewCard } from 'src/components/ReviewCard';
import { LoginURL } from 'src/components/LoginURL';

interface ViewerAndReviewsProps {
  viewerReview: Review;
  otherReviews: Review[];
}

const ViewerAndReviews = ({
  viewerReview,
  otherReviews,
}: ViewerAndReviewsProps) => {
  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Your review</h2>
      <ReviewCard {...viewerReview} />
      <h3 className='text-2xl font-bold mt-6 mb-4'>Other reviews</h3>
      {otherReviews.length > 0
        ? otherReviews.map((review) => (
            <ReviewCard key={review.id} {...review} />
          ))
        : 'No other reviews. This feels very quiet...'}
    </div>
  );
};

interface ReviewsProps {
  movieId: number;
  viewer: Awaited<ReturnType<typeof getPotentialUser>>;
  reviews: Review[];
}

const Reviews = ({ movieId, viewer, reviews }: ReviewsProps) => {
  return (
    <div>
      <h2 className='text-2xl font-bold'>Reviews</h2>
      {viewer ? (
        <>
          <p className='mt-2 mb-4'>What are your thoughts on this movie?</p>
          <WriteReviewForm movieId={movieId} />
          <h3 className='text-xl font-bold mt-6 mb-2'>Other reviews</h3>
        </>
      ) : (
        <p className='mt-2 mb-4'>
          What are your thoughts on this movie?{' '}
          <LoginURL>Login to review</LoginURL>.
        </p>
      )}
      {reviews.length > 0 ? (
        <ul className='flex flex-col gap-2'>
          {reviews.map((review) => (
            <ReviewCard key={review.id} {...review} />
          ))}
        </ul>
      ) : (
        'No reviews yet.'
      )}
    </div>
  );
};

export default async function MovieReviews({
  params,
}: {
  params: { movieId: string };
}) {
  const movieId = parseInt(params.movieId, 10);

  const [viewer, movie, reviews] = await Promise.all([
    getPotentialUser(),
    getMovieById(movieId),
    getReviews({ movieId }),
  ]);

  const viewerReview = viewer
    ? reviews.find((review) => review.owner === viewer.email)
    : undefined;

  const otherReviews = viewer
    ? reviews.filter((review) => review.owner !== viewer.email)
    : reviews;

  return (
    <div className='w-full px-4 grid grid-areas-[cover_cover,details_reviews] gap-x-12 gap-y-6 grid-cols-[1fr,2fr]'>
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
          <span className='font-bold'>Release date</span> {movie.release_date}
        </p>
      </div>
      <div className='grid-in-[reviews]'>
        {viewerReview ? (
          <ViewerAndReviews
            viewerReview={viewerReview}
            otherReviews={otherReviews}
          />
        ) : (
          <Reviews viewer={viewer} movieId={movieId} reviews={otherReviews} />
        )}
      </div>
    </div>
  );
}
