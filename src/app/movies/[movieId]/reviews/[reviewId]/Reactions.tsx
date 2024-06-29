import {
  Review,
  getReaction,
  getReactionsByReviewId,
  getReactionsCountByReviewId,
  getReviewById,
} from 'src/app/db/reviews';
import { User, getPotentialUser } from 'src/app/lib/auth';
import { ReviewCard } from '../ReviewCard';
import { LoginURL } from '../../LoginURL';
import { WriteReviewForm } from '../../WriteReviewForm';
import { Suspense } from 'react';

const ReactionsList = async ({
  reviewId,
  viewer,
}: {
  reviewId: number;
  viewer?: User;
}) => {
  const reactions = await getReactionsByReviewId(reviewId);

  return reactions.map((reaction) => (
    <ReviewCard
      key={reaction.id}
      areThumbsReadOnly={!viewer || reaction.owner === viewer.email}
      review={reaction}
      hideReactionLink
    />
  ));
};

type ReactionsProps = {
  review: Review;
  viewer: Awaited<ReturnType<typeof getPotentialUser>>;
};

export const Reactions = async ({ review, viewer }: ReactionsProps) => {
  const reactions = await getReactionsCountByReviewId(review.id);

  if (review.parentReviewId !== null) {
    const parentReview = await getReviewById(review.parentReviewId);

    return (
      <div className='mt-6'>
        <h3 className='text-2xl font-bold mb-4'>In response to review</h3>
        {parentReview ? (
          <ReviewCard
            areThumbsReadOnly={viewer?.email === parentReview.owner}
            review={parentReview}
          />
        ) : (
          <p>Failed to fetch review {review.parentReviewId}</p>
        )}
      </div>
    );
  }

  if (!viewer) {
    return (
      <div className='mt-6'>
        <h3 className='text-2xl font-bold mb-4'>Reactions</h3>
        {reactions === 0 ? (
          <div>
            No reactions. <LoginURL>Login to react</LoginURL>
          </div>
        ) : (
          <div className='mt-4 flex flex-col gap-4'>
            <LoginURL>Login to react</LoginURL>
            <Suspense fallback='Loading reactions...'>
              <ReactionsList reviewId={review.id} />
            </Suspense>
          </div>
        )}
      </div>
    );
  }

  const myReaction = await getReaction({
    owner: viewer.email,
    parentReviewId: review.id,
  });

  return (
    <div className='mt-6'>
      {viewer.email !== review.owner && !myReaction ? (
        <div className='mb-6'>
          <h3 className='text-2xl font-bold mb-4'>Add your reaction</h3>
          <WriteReviewForm
            movieId={review.movieId}
            parentReviewId={review.id}
          />
        </div>
      ) : null}
      <h3 className='text-2xl font-bold mb-4'>Reactions</h3>
      {reactions === 0 ? (
        <div>No reactions.</div>
      ) : (
        <div className='mt-4 flex flex-col gap-4'>
          <Suspense fallback='Loading reactions...'>
            <ReactionsList reviewId={review.id} />
          </Suspense>
        </div>
      )}
    </div>
  );
};
