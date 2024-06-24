import {
  InferInsertModel,
  and,
  count,
  eq,
  isNotNull,
  isNull,
  sql,
  sum,
} from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { db, schema } from 'root/db/db';
import { getRatingsCountQuery } from './ratings';

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

  const ratings = getRatingsCountQuery().as('ratings');

  return db
    .select({
      id: schema.reviews.id,
      movieId: schema.reviews.movieId,
      createdAt: schema.reviews.createdAt,
      owner: schema.reviews.owner,
      title: schema.reviews.title,
      review: schema.reviews.review,
      ratings: {
        positive: sql`sum(coalesce(${ratings.positive}, 0))`.mapWith(Number),
        negative: sql`sum(coalesce(${ratings.negative}, 0))`.mapWith(Number),
      },
      parentReviewId: schema.reviews.parentReviewId,
      reaction_ids: sql<
        number[]
      >`array_remove(array_agg(${reactions.id} order by ${reactions.createdAt} desc), null)`,
    })
    .from(schema.reviews)
    .leftJoin(ratings, eq(schema.reviews.id, ratings.reviewId))
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
  return buildReviewWithRatingsQuery().where(
    and(isNull(schema.reviews.parentReviewId), eq(schema.reviews.owner, owner))
  );
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
