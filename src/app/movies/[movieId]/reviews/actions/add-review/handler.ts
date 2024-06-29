'use server';

import { getUser } from 'src/app/lib/auth';
import { ReviewFormData, reviewForm } from './validation';
import { insertReview } from 'src/app/db/reviews';
import { inngest } from 'src/ingest/client';
import { revalidateTag } from 'next/cache';

export async function addReview(formData: ReviewFormData) {
  const data = reviewForm.parse(formData);
  const user = await getUser();

  const [review] = await insertReview({
    owner: user.email,
    movieId: data.movieId,
    title: formData.title,
    review: data.review,
    parentReviewId: data.parentReviewId,
  });

  if (data.parentReviewId != null) {
    revalidateTag(`reactions:${data.parentReviewId}`);
  } else {
    revalidateTag(`reviews:${user.email}`);
  }

  if (data.parentReviewId) {
    await inngest.send({
      name: 'reviews/send.new.reaction.email',
      data: {
        reactionId: review.id,
      },
    });
  }

  return review;
}
