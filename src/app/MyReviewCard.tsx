import { Review } from './db/reviews';
import { Movie } from './lib/movies-service';
import {
  Card,
  CardAside,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
  CardFooter,
} from 'src/components/ui/Card';
import Image from 'next/image';
import Link from 'next/link';
import { ThumbsCounter } from './movies/[movieId]/reviews/ThumbsCounter';

export function MyReviewCard({
  movie,
  review,
}: {
  movie: Movie;
  review: Review;
}) {
  return (
    <Link href={`/movies/${movie.id}/reviews/${review.id}`}>
      <Card>
        <div className='flex'>
          {movie.poster_path && (
            <CardAside className='relative aspect-[9/14] max-w-[150px] w-full shrink-0'>
              <Image
                src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                alt={`Cover for ${movie.title}`}
                fill
                sizes='100%'
                style={{
                  objectFit: 'cover',
                }}
              />
            </CardAside>
          )}
          <div className='min-w-0'>
            <CardHeader>
              <CardDescription>{movie.title}</CardDescription>
              <CardTitle className='text-lg overflow-hidden text-ellipsis whitespace-nowrap'>
                {review.title}
              </CardTitle>
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
                isReadOnly
              />
              {review.reaction_ids.length > 0 && (
                <span className='underline hover:no-underline'>
                  {review.reaction_ids.length === 1
                    ? 'Read reaction'
                    : 'Read reactions'}
                </span>
              )}
            </CardFooter>
          </div>
        </div>
      </Card>
    </Link>
  );
}
