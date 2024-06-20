export default async function MovieReviews({
  params,
}: {
  params: { movieId: number };
}) {
  return <h1>Reviews for movie ID {params.movieId}!</h1>;
}
