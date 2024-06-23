import { Suspense } from 'react';
import { Review, getReaction, getReviewById } from 'src/app/db/reviews';
import { getPotentialUser } from 'src/app/lib/auth';
import { ReviewCard } from '../ReviewCard';
import { LoginURL } from '../../LoginURL';
import { WriteReviewForm } from '../../WriteReviewForm';

const ReactionCard = async ({ reviewId }: { reviewId: number }) => {
  const viewer = await getPotentialUser();
  const review = await getReviewById(reviewId);

  return (
    <ReviewCard
      areThumbsReadOnly={!viewer || review.owner === viewer.email}
      review={review}
      hideReactionLink
    />
  );
};

type ReactionsProps = {
  review: Review;
  viewer: Awaited<ReturnType<typeof getPotentialUser>>;
};

export const Reactions = async ({ review, viewer }: ReactionsProps) => {
  if (review.parentReviewId !== null) {
    const parentReview = await getReviewById(review.parentReviewId!);

    return (
      <div className='mt-6'>
        <h3 className='text-2xl font-bold mb-4'>In response to review</h3>
        <ReviewCard
          areThumbsReadOnly={viewer?.email === parentReview.owner}
          review={parentReview}
        />
      </div>
    );
  }

  if (!viewer) {
    return (
      <div className='mt-6'>
        <h3 className='text-2xl font-bold mb-4'>Reactions</h3>
        {review.reaction_ids.length === 0 ? (
          <div>
            No reactions. <LoginURL>Login to react</LoginURL>
          </div>
        ) : (
          <div className='mt-4 flex flex-col gap-4'>
            <LoginURL>Login to react</LoginURL>
            {review.reaction_ids.map((reaction) => (
              <Suspense key={reaction}>
                <ReactionCard reviewId={reaction} />
              </Suspense>
            ))}
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
      {review.reaction_ids.length === 0 ? (
        <div>No reactions.</div>
      ) : (
        <div className='mt-4 flex flex-col gap-4'>
          {review.reaction_ids.map((reaction) => (
            <Suspense key={reaction}>
              <ReactionCard reviewId={reaction} />
            </Suspense>
          ))}
        </div>
      )}
    </div>
  );
};
