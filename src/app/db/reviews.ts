import {
  InferInsertModel,
  and,
  count,
  eq,
  isNotNull,
  isNull,
} from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { db, schema } from 'root/db/db';
import { getDate } from 'src/lib/get-date';

export type Review = NonNullable<
  Awaited<ReturnType<typeof getReviewsByMovieId>>
>[number];

export const insertReview = (
  params: InferInsertModel<typeof schema.reviews>
) => {
  return db.insert(schema.reviews).values(params).returning();
};

export const getReviewsByMovieId = (movieId: number) => {
  return unstable_cache(
    (_movieId: number) =>
      db.query.reviews.findMany({
        where: and(
          isNull(schema.reviews.parentReviewId),
          eq(schema.reviews.movieId, _movieId)
        ),
      }),
    ['reviewsByMovieId', movieId.toString()],
    { revalidate: false, tags: [`reviews:movieId=${movieId}`] }
  )(movieId);
};

export const getReviewsByOwner = (owner: string) => {
  return unstable_cache(
    (_owner: string) =>
      db.query.reviews.findMany({
        where: and(
          isNull(schema.reviews.parentReviewId),
          eq(schema.reviews.owner, _owner)
        ),
      }),
    ['reviewsByOwner', owner],
    { revalidate: false, tags: [`reviews:owner=${owner}`] }
  )(owner);
};

export const getReviewById = async (reviewId: number) => {
  return unstable_cache(
    (_reviewId: number) =>
      db.query.reviews.findFirst({
        where: eq(schema.reviews.id, _reviewId),
      }),
    ['review', reviewId.toString()],
    { revalidate: false, tags: [`review:id=${reviewId}`] }
  )(reviewId);
};

export const getReviewsCountByDate = async ({ date }: { date: Date }) => {
  const [result] = await db
    .select({ count: count() })
    .from(schema.reviews)
    .where(
      and(
        eq(schema.reviews.createdAt, getDate(date)),
        isNull(schema.reviews.parentReviewId)
      )
    );

  return result?.count ?? 0;
};
