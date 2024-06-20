export default async function ReviewDetail({
  params,
}: {
  params: { movieId: number; reviewId: number };
}) {
  return (
    <h1>
      Details for review ID {params.reviewId} and movie ID {params.movieId}!
    </h1>
  );
}
