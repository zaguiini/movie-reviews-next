import { Review } from 'src/app/db/reviews';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/Card';

export const ReviewCard = (review: Review) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>{review.title}</CardTitle>
        <CardDescription>
          {review.owner} on{' '}
          {new Intl.DateTimeFormat('en').format(review.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent>{review.review}</CardContent>
    </Card>
  );
};
