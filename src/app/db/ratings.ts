import { eq } from 'drizzle-orm';
import { db, schema } from 'root/db/db';

export type Rating = NonNullable<
  Awaited<ReturnType<typeof getRatingsByReviewId>>
>[number];

export const getRatingsByReviewId = (reviewId: number) => {
  return db.query.ratings.findMany({
    where: eq(schema.ratings.reviewId, reviewId),
    columns: {
      owner: true,
      outcome: true,
    },
  });
};
