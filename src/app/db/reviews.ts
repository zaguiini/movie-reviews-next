import { InferInsertModel, InferSelectModel, eq } from 'drizzle-orm';
import { db, schema } from 'root/db/db';

export type Review = InferSelectModel<typeof schema.reviews>;

export const insertReview = ({
  owner,
  movieId,
  title,
  review,
}: InferInsertModel<typeof schema.reviews>) => {
  return db
    .insert(schema.reviews)
    .values({
      owner,
      movieId,
      title,
      review,
    })
    .returning();
};

export const getReviewsByMovieId = (movieId: number) => {
  return db.query.reviews.findMany({
    where: eq(schema.reviews.movieId, movieId),
  });
};

export const getReviewsByOwner = (owner: string) => {
  return db.query.reviews.findMany({
    where: eq(schema.reviews.owner, owner),
  });
};

export const getReviewById = (reviewId: number) => {
  return db.query.reviews.findFirst({
    where: eq(schema.reviews.id, reviewId),
  });
};
