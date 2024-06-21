import { InferInsertModel, InferSelectModel, eq } from 'drizzle-orm';
import { db, schema } from 'root/db/db';

export type Review = InferSelectModel<typeof schema.ReviewsTable>;

export const insertReview = ({
  owner,
  movieId,
  title,
  review,
}: InferInsertModel<typeof schema.ReviewsTable>) => {
  return db
    .insert(schema.ReviewsTable)
    .values({
      owner,
      movieId,
      title,
      review,
    })
    .returning();
};

export const getReviews = ({ movieId }: Pick<Review, 'movieId'>) => {
  return db
    .select()
    .from(schema.ReviewsTable)
    .where(eq(schema.ReviewsTable.movieId, movieId));
};
