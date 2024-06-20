export default async function MovieDetail({
  params,
}: {
  params: { movieId: number };
}) {
  return <h1>Details for movie ID {params.movieId}!</h1>;
}
