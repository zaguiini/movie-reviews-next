import Link from 'next/link';
import { CardDescription, CardTitle } from 'src/components/ui/Card';
import { getReviewById } from 'src/app/db/reviews';
import { ThumbsCounter } from '../ThumbsCounter';
import { getPotentialUser } from 'src/app/lib/auth';

export default async function ReviewDetail({
  params,
}: {
  params: { movieId: string; reviewId: string };
}) {
  const viewer = await getPotentialUser();
  const reviewId = parseInt(params.reviewId, 10);
  const review = await getReviewById(reviewId);

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

  return (
    <div>
      <div className='flex flex-col'>
        <CardDescription>
          Review by {review.owner.split('@')[0]} on{' '}
          {new Intl.DateTimeFormat('en').format(review.createdAt)}
        </CardDescription>

        <CardTitle className='text-lg mt-2 mb-4'>
          <Link href={`/movies/${review.movieId}/reviews/${review.id}`}>
            {review.title}
          </Link>
        </CardTitle>

        <p>{review.review}</p>

        <div className='flex mt-4 gap-x-6 justify-start'>
          <ThumbsCounter
            up={{ total: 4, users: ['user1', 'user2', 'user3', 'user4'] }}
            down={{ total: 0, users: [] }}
            isReadOnly={!viewer || review.owner === viewer.email}
          />
        </div>
      </div>
    </div>
  );
}
