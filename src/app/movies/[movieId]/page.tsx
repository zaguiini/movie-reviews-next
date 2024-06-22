import { WriteReviewForm } from './WriteReviewForm';
import { Review, getReviewsByMovieId } from 'src/app/db/reviews';
import { getPotentialUser } from 'src/app/lib/auth';
import { ReviewCard } from './reviews/ReviewCard';
import { LoginURL } from './LoginURL';

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
      <ReviewCard review={viewerReview} areThumbsReadOnly />
      <h3 className='text-2xl font-bold mt-6 mb-4'>Other reviews</h3>
      {otherReviews.length > 0 ? (
        <ul className='flex flex-col gap-2'>
          {otherReviews.map((review) => (
            <li key={review.id}>
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>
      ) : (
        'No other reviews. This feels very quiet...'
      )}
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
            <li key={review.id}>
              <ReviewCard review={review} areThumbsReadOnly={!viewer} />
            </li>
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

  const [viewer, reviews] = await Promise.all([
    getPotentialUser(),
    getReviewsByMovieId(movieId),
  ]);

  const viewerReview = viewer
    ? reviews.find((review) => review.owner === viewer.email)
    : undefined;

  const otherReviews = viewer
    ? reviews.filter((review) => review.owner !== viewer.email)
    : reviews;

  return viewerReview ? (
    <ViewerAndReviews viewerReview={viewerReview} otherReviews={otherReviews} />
  ) : (
    <Reviews viewer={viewer} movieId={movieId} reviews={otherReviews} />
  );
}
