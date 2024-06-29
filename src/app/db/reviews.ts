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
    ['reviews', 'movieId', movieId.toString()],
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
    ['reviews', 'owner', owner],
    { revalidate: false, tags: [`reviews:owner=${owner}`] }
  )(owner);
};

export const getReactionsByReviewId = (reviewId: number) => {
  return unstable_cache(
    (_reviewId: number) =>
      db.query.reviews.findMany({
        where: and(eq(schema.reviews.parentReviewId, _reviewId)),
      }),
    [`reactions`, reviewId.toString()],
    { revalidate: false, tags: [`reactions:reviewId=${reviewId}`] }
  )(reviewId);
};

export const getReactionsCountByReviewId = (reviewId: number) => {
  return unstable_cache(
    async (_reviewId: number) => {
      const [result] = await db
        .select({ count: count() })
        .from(schema.reviews)
        .where(eq(schema.reviews.parentReviewId, _reviewId));

      return result.count;
    },
    [`reactionsCount`, reviewId.toString()],
    { revalidate: false, tags: [`reactions:reviewId=${reviewId}`] }
  )(reviewId);
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

interface Params {
  owner: string;
  parentReviewId: number;
}

export const getReaction = async ({ owner, parentReviewId }: Params) => {
  return unstable_cache(
    (_params: Params) =>
      db.query.reviews.findFirst({
        where: and(
          eq(schema.reviews.owner, _params.owner),
          eq(schema.reviews.parentReviewId, _params.parentReviewId)
        ),
      }),
    ['reaction', 'owner', owner, 'parentReview', parentReviewId.toString()],
    {
      revalidate: false,
      tags: [`reactions:owner=${owner},reviewId=${parentReviewId}`],
    }
  )({ owner, parentReviewId });
};

const getDate = (date: Date) => date.toISOString().split('T')[0];

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

export const getReactionsCountByDate = async ({ date }: { date: Date }) => {
  const [result] = await db
    .select({ count: count() })
    .from(schema.reviews)
    .where(
      and(
        eq(schema.reviews.createdAt, getDate(date)),
        isNotNull(schema.reviews.parentReviewId)
      )
    );

  return result?.count ?? 0;
};
