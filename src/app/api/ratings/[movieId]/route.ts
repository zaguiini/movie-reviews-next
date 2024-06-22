import { getRatingsByReviewId } from '../../../db/ratings';

export const GET = async (
  _: Request,
  { params }: { params: { movieId: string } }
) => {
  const movieId = parseInt(params.movieId, 10);
  const ratings = await getRatingsByReviewId(movieId);

  return Response.json(
    ratings.map((rating) => ({
      ...rating,
      owner: rating.owner.split('@')[0],
    }))
  );
};
