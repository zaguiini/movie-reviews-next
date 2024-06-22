'use client';

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

export const MyReviewCard = ({
  movie,
  review,
}: {
  movie: Movie;
  review: Review;
}) => (
  <Link href={`/movies/${movie.id}/reviews/${review.id}`}>
    <Card>
      <div className='flex'>
        {movie.poster_path && (
          <CardAside className='aspect-[9/15] relative max-w-[100px] w-full'>
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
        <div>
          <CardHeader>
            <CardDescription>{movie.title}</CardDescription>
            <CardTitle className='text-lg'>{review.title}</CardTitle>
          </CardHeader>
          <CardContent>{review.review}</CardContent>
          <CardFooter className='flex gap-x-6 justify-start'>
            <ThumbsCounter
              up={{ total: 4, users: ['user1', 'user2', 'user3', 'user4'] }}
              down={{ total: 0, users: [] }}
              isReadOnly
            />
            <span className='underline hover:no-underline'>Read reaction</span>
          </CardFooter>
        </div>
      </div>
    </Card>
  </Link>
);
