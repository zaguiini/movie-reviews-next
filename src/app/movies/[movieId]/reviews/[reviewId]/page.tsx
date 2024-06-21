import Link from 'next/link';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../../components/ui/Card';
import { getReviewById } from '../../../../db/reviews';

export default async function ReviewDetail({
  params,
}: {
  params: { reviewId: string };
}) {
  const reviewId = parseInt(params.reviewId, 10);
  const [review] = await getReviewById(reviewId);

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
      </div>
    </div>
  );
}
