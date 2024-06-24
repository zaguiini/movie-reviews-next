import { getRatingsByReviewId } from '../../../db/ratings';

export const GET = async (
  _: Request,
  { params }: { params: { reviewId: string } }
) => {
  const reviewId = parseInt(params.reviewId, 10);
  const ratings = await getRatingsByReviewId(reviewId);

  return Response.json(
    ratings.map((rating) => ({
      ...rating,
      owner: rating.owner.split('@')[0],
    }))
  );
};
