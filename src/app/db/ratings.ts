'use server';

import { and, eq } from 'drizzle-orm';
import { db, schema } from 'root/db/db';
import { getUser } from 'src/app/lib/auth';

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
    limit: 50,
    orderBy: schema.ratings.createdAt,
  });
};

export const getRating = ({
  reviewId,
  owner,
}: {
  reviewId: number;
  owner: string;
}) => {
  return db.query.ratings.findFirst({
    where: and(
      eq(schema.ratings.reviewId, reviewId),
      eq(schema.ratings.owner, owner)
    ),
  });
};

interface ToggleRatingParams {
  reviewId: number;
  outcome: Rating['outcome'];
}

export const toggleRating = async ({
  reviewId,
  outcome,
}: ToggleRatingParams) => {
  const viewer = await getUser();

  const whereClause = and(
    eq(schema.ratings.reviewId, reviewId),
    eq(schema.ratings.owner, viewer.email)
  );

  const existingRating = await db.query.ratings.findFirst({
    where: whereClause,
  });

  if (!existingRating) {
    return db
      .insert(schema.ratings)
      .values({
        reviewId,
        owner: viewer.email,
        outcome,
      })
      .returning();
  }

  if (existingRating && outcome === existingRating.outcome) {
    return db.delete(schema.ratings).where(whereClause);
  }

  return db
    .update(schema.ratings)
    .set({ outcome })
    .where(whereClause)
    .returning();
};
