'use server';

import { getUser } from 'src/app/lib/auth';
import { ReviewFormData, reviewForm } from './validation';
import { insertReview } from 'src/app/db/reviews';

export async function addReview(formData: ReviewFormData) {
  const data = reviewForm.parse(formData);
  const user = await getUser();

  const review = await insertReview({
    owner: user.email,
    movieId: data.movieId,
    title: formData.title,
    review: data.review,
    parentReviewId: data.parentReviewId,
  });

  return review;
}
