import { inngest } from 'src/ingest/client';
import { Resend } from 'resend';
import NewReactionEmail from './template';
import { getReviewById } from '../../db/reviews';
import { NonRetriableError } from 'inngest';
import { getBaseUrl } from 'src/lib/get-base-url';

const getExcerpt = (review: string) => {
  if (review.length < 150) {
    return review;
  }

  let trimmedReview = review.substring(0, 150);
  trimmedReview = trimmedReview.substring(
    0,
    Math.min(trimmedReview.length, trimmedReview.lastIndexOf(' '))
  );

  return `${trimmedReview}…`;
};

export class ReactionHasNoParentError extends Error {
  reviewId: number;

  public constructor({ reviewId }: { reviewId: number }) {
    super();
    this.reviewId = reviewId;
  }
}

export const sendNewReactionEmail = inngest.createFunction(
  { id: 'send-new-reaction-email' },
  { event: 'reviews/send.new.reaction.email' },
  async ({ event, step }) => {
    const reaction = await getReviewById(event.data.reactionId);

    if (reaction.parentReviewId === null) {
      const cause = new ReactionHasNoParentError({ reviewId: reaction.id });
      throw new NonRetriableError('Review has no parent review ID', { cause });
    }

    const review = await getReviewById(reaction.parentReviewId);

    await step.run('send-email', async () => {
      const resend = new Resend(process.env.RESEND_API_KEY);

      const host = getBaseUrl();

      const { data, error } = await resend.emails.send({
        from: `Movies Review Next <movies.review.next@luisfelipezaguini.com>`,
        to: [review.owner],
        subject: 'Your review got a new reaction!',
        react: NewReactionEmail({
          reviewOwner: review.owner.split('@')[0],
          reviewLink: `${host}/movies/${review.movieId}/reviews/${review.id}`,
          reactionExcerpt: getExcerpt(reaction.review),
          reactionLink: `${host}/movies/${reaction.movieId}/reviews/${reaction.id}`,
        }),
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    });

    return { event };
  }
);
