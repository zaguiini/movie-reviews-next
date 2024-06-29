import { and, eq, sql } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { db, schema } from 'root/db/db';
import type { User } from 'src/app/lib/auth';

export type Rating = NonNullable<
  Awaited<ReturnType<typeof getRatingsByReviewId>>
>[number];

export const getRatingsByReviewId = (reviewId: number) => {
  return unstable_cache(
    (_reviewId: number) =>
      db.query.ratings.findMany({
        where: eq(schema.ratings.reviewId, _reviewId),
        columns: {
          owner: true,
          outcome: true,
        },
        limit: 50,
        orderBy: schema.ratings.createdAt,
      }),
    ['ratingsList', reviewId.toString()],
    { revalidate: false, tags: [`ratings:${reviewId}`] }
  )(reviewId);
};

export const getRatingsCountByReviewId = (reviewId: number) => {
  return unstable_cache(
    async (_reviewId: number) => {
      const [result] = await db
        .select({
          reviewId: schema.ratings.reviewId,
          positive:
            sql`coalesce(sum(case when ${schema.ratings.outcome} = 'positive' then 1 else 0 end), 0)`
              .mapWith(Number)
              .as('positive'),
          negative:
            sql`coalesce(sum(case when ${schema.ratings.outcome} = 'negative' then 1 else 0 end), 0)`
              .mapWith(Number)
              .as('negative'),
        })
        .from(schema.ratings)
        .where(eq(schema.ratings.reviewId, _reviewId))
        .groupBy(schema.ratings.reviewId)
        .limit(1);

      return {
        positive: result?.positive ?? 0,
        negative: result?.negative ?? 0,
      };
    },
    ['ratingsCount', reviewId.toString()],
    {
      revalidate: false,
      tags: [`ratings:${reviewId}`],
    }
  )(reviewId);
};

interface GetRatingParams {
  reviewId: number;
  owner: string;
}

export const getRating = ({ reviewId, owner }: GetRatingParams) => {
  return unstable_cache(
    (_params: GetRatingParams) =>
      db.query.ratings.findFirst({
        where: and(
          eq(schema.ratings.reviewId, _params.reviewId),
          eq(schema.ratings.owner, _params.owner)
        ),
      }),
    ['ratings', `${reviewId}-${owner}`],
    { revalidate: false, tags: [`ratings:${reviewId}`] }
  )({ reviewId, owner });
};

interface ToggleRatingParams {
  user: User;
  reviewId: number;
  outcome: Rating['outcome'];
}

export const toggleRating = async ({
  user,
  reviewId,
  outcome,
}: ToggleRatingParams) => {
  const whereClause = and(
    eq(schema.ratings.reviewId, reviewId),
    eq(schema.ratings.owner, user.email)
  );

  const existingRating = await db.query.ratings.findFirst({
    where: whereClause,
  });

  if (!existingRating) {
    return db
      .insert(schema.ratings)
      .values({
        reviewId,
        owner: user.email,
        outcome,
      })
      .returning();
  }

  if (existingRating && outcome === existingRating.outcome) {
    await db.delete(schema.ratings).where(whereClause);
    return;
  }

  return db
    .update(schema.ratings)
    .set({ outcome })
    .where(whereClause)
    .returning();
};
