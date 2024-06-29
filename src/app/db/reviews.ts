import {
  InferInsertModel,
  and,
  count,
  eq,
  isNotNull,
  isNull,
  sql,
} from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
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

const buildReviewWithRatingsQuery = () => {
  const reactions = alias(schema.reviews, 'reactions');

  return db
    .select({
      id: schema.reviews.id,
      movieId: schema.reviews.movieId,
      createdAt: schema.reviews.createdAt,
      owner: schema.reviews.owner,
      title: schema.reviews.title,
      review: schema.reviews.review,
      ratings: {
        positive:
          sql`(select count(*) from ratings where ${schema.ratings.reviewId} = ${schema.reviews.id} and ${schema.ratings.outcome} = 'positive')`.mapWith(
            Number
          ),
        negative:
          sql`(select count(*) from ratings where ${schema.ratings.reviewId} = ${schema.reviews.id} and ${schema.ratings.outcome} = 'negative')`.mapWith(
            Number
          ),
      },
      parentReviewId: schema.reviews.parentReviewId,
      reaction_ids: sql<
        number[]
      >`array_remove(array_agg(${reactions.id} order by ${reactions.createdAt} desc), null)`,
    })
    .from(schema.reviews)
    .leftJoin(reactions, eq(schema.reviews.id, reactions.parentReviewId))
    .groupBy(schema.reviews.id);
};

export const getReviewsByMovieId = (movieId: number) => {
  return buildReviewWithRatingsQuery().where(
    and(
      isNull(schema.reviews.parentReviewId),
      eq(schema.reviews.movieId, movieId)
    )
  );
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
    ['reviews', owner],
    { revalidate: false, tags: [`reviews:${owner}`] }
  )(owner);
};

export const getReactionsByReviewId = (reviewId: number) => {
  return unstable_cache(
    (_reviewId: number) =>
      db.query.reviews.findMany({
        where: and(eq(schema.reviews.parentReviewId, _reviewId)),
      }),
    [`reactions`, reviewId.toString()],
    { revalidate: false, tags: [`reactions:${reviewId}`] }
  )(reviewId);
};

export const getReviewById = async (reviewId: number) => {
  const [result] = await buildReviewWithRatingsQuery()
    .where(eq(schema.reviews.id, reviewId))
    .limit(1);

  return result;
};

export const getReaction = async ({
  owner,
  parentReviewId,
}: {
  owner: string;
  parentReviewId: number;
}) => {
  return db.query.reviews.findFirst({
    where: and(
      eq(schema.reviews.owner, owner),
      eq(schema.reviews.parentReviewId, parentReviewId)
    ),
  });
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
