import { Review } from 'src/app/db/reviews';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardSidebar,
  CardTitle,
} from './ui/Card';
import { Movie } from 'src/app/lib/movies-service';
import Image from 'next/image';
import Link from 'next/link';

export const ReviewCard = ({
  movie,
  review,
}: {
  movie?: Movie;
  review: Review;
}) => {
  if (movie) {
    return (
      <Link href={`/movies/${movie.id}`}>
        <Card>
          <div className='flex'>
            {movie.poster_path && (
              <CardSidebar className='aspect-[9/15] relative max-w-[100px] w-full'>
                <Image
                  src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                  alt={`Cover for ${movie.title}`}
                  fill
                  sizes='100%'
                  style={{
                    objectFit: 'cover',
                  }}
                />
              </CardSidebar>
            )}
            <div>
              <CardHeader>
                <CardDescription>{movie.title}</CardDescription>
                <CardTitle className='text-lg'>{review.title}</CardTitle>
              </CardHeader>
              <CardContent>{review.review}</CardContent>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>{review.title}</CardTitle>
        <CardDescription>
          {review.owner.split('@')[0]} on{' '}
          {new Intl.DateTimeFormat('en').format(review.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent>{review.review}</CardContent>
    </Card>
  );
};
