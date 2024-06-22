import { Review } from 'src/app/db/reviews';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from 'src/components/ui/Card';
import Link from 'next/link';
import { ThumbsCounter } from './ThumbsCounter';

export const ReviewCard = ({
  review,
  areThumbsReadOnly = false,
}: {
  review: Review;
  areThumbsReadOnly?: boolean;
}) => {
  return (
    <Card>
      <CardHeader>
        <Link href={`/movies/${review.movieId}/reviews/${review.id}`}>
          <CardTitle className='text-lg'>{review.title}</CardTitle>
        </Link>
        <CardDescription>
          {review.owner.split('@')[0]} on{' '}
          {new Intl.DateTimeFormat('en').format(review.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent>{review.review}</CardContent>
      <CardFooter className='flex gap-x-6 justify-start'>
        <ThumbsCounter
          reviewId={review.id}
          ratings={review.ratings}
          isReadOnly={areThumbsReadOnly}
        />
        <span className='underline hover:no-underline'>Read reaction</span>
      </CardFooter>
    </Card>
  );
};
