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
import { getPotentialUser } from 'src/app/lib/auth';
import { getRating } from '../../../db/ratings';
import { formatDate } from 'src/lib/format';

export const ReviewCard = async ({
  review,
  areThumbsReadOnly = false,
  hideReactionLink = false,
}: {
  review: Review;
  areThumbsReadOnly?: boolean;
  hideReactionLink?: boolean;
}) => {
  const user = await getPotentialUser();
  const myRating = user
    ? await getRating({ reviewId: review.id, owner: user.email })
    : undefined;

  return (
    <Card>
      <CardHeader>
        <Link href={`/movies/${review.movieId}/reviews/${review.id}`}>
          <CardTitle className='text-lg overflow-hidden text-ellipsis whitespace-nowrap'>
            {review.title}
          </CardTitle>
        </Link>
        <CardDescription>
          {review.owner.split('@')[0]} on {formatDate(review.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className='overflow-hidden text-ellipsis whitespace-nowrap'>
          {review.review}
        </p>
      </CardContent>
      <CardFooter className='flex gap-x-6 justify-start'>
        <ThumbsCounter
          reviewId={review.id}
          ratings={review.ratings}
          isReadOnly={areThumbsReadOnly}
          myRating={myRating?.outcome}
        />
        {!hideReactionLink && (
          <>
            <Link
              href={`/movies/${review.movieId}/reviews/${review.id}`}
              className='underline hover:no-underline'
            >
              {review.reaction_ids.length === 0
                ? 'See reactions'
                : review.reaction_ids.length === 1
                  ? 'Read reaction'
                  : 'Read reactions'}
            </Link>
          </>
        )}
      </CardFooter>
    </Card>
  );
};
