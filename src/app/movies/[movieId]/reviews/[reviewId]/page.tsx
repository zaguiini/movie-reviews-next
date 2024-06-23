import Link from 'next/link';
import { CardDescription, CardTitle } from 'src/components/ui/Card';
import { getReviewById } from 'src/app/db/reviews';
import { ThumbsCounter } from '../ThumbsCounter';
import { getPotentialUser } from 'src/app/lib/auth';
import { getRating } from '../../../../db/ratings';
import { Reactions } from './Reactions';
import { formatDate } from 'src/lib/format';

export default async function ReviewDetail({
  params,
}: {
  params: { movieId: string; reviewId: string };
}) {
  const reviewId = parseInt(params.reviewId, 10);
  const [viewer, review] = await Promise.all([
    getPotentialUser(),
    getReviewById(reviewId),
  ]);

  if (!review) {
    return (
      <p>
        Not found.{' '}
        <Link
          href={`/movies/${params.movieId}`}
          className='underline hover:no-underline'
        >
          Browse reviews
        </Link>
      </p>
    );
  }

  const myRating = viewer
    ? await getRating({ reviewId: review.id, owner: viewer.email })
    : undefined;

  return (
    <div>
      <div className='flex flex-col'>
        <CardDescription>
          {review.parentReviewId ? 'Reaction' : 'Review'} by{' '}
          {review.owner.split('@')[0]} on {formatDate(review.createdAt)}
        </CardDescription>

        <CardTitle className='text-lg mt-2 mb-4'>
          <Link href={`/movies/${review.movieId}/reviews/${review.id}`}>
            {review.title}
          </Link>
        </CardTitle>

        <p>{review.review}</p>

        <div className='flex mt-4 gap-x-6 items-center justify-start'>
          <ThumbsCounter
            reviewId={review.id}
            ratings={review.ratings}
            myRating={myRating?.outcome}
            isReadOnly={!viewer || review.owner === viewer.email}
          />
          {review.parentReviewId === null && (
            <span>
              {review.reaction_ids.length === 1
                ? '1 reaction'
                : `${review.reaction_ids.length} reactions`}
            </span>
          )}
        </div>
      </div>
      <Reactions review={review} viewer={viewer} />
    </div>
  );
}
