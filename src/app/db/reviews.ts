import { InferInsertModel, eq, sql, sum } from 'drizzle-orm';
import { db, schema } from 'root/db/db';

export type Review = NonNullable<
  Awaited<ReturnType<typeof getReviewsByMovieId>>
>[number];

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

const buildReviewWithRatingsQuery = () => {
  const ratings = db
    .select({
      reviewId: schema.ratings.reviewId,
      positive: sum(
        sql`case when ${schema.ratings.outcome} = 'positive' then 1 else 0 end`
      ).as('positive'),
      negative: sum(
        sql`case when ${schema.ratings.outcome} = 'negative' then 1 else 0 end`
      ).as('negative'),
    })
    .from(schema.ratings)
    .groupBy(schema.ratings.reviewId)
    .as('ratings');

  return db
    .select({
      id: schema.reviews.id,
      movieId: schema.reviews.movieId,
      createdAt: schema.reviews.createdAt,
      owner: schema.reviews.owner,
      title: schema.reviews.title,
      review: schema.reviews.review,
      ratings: {
        positive: sql`coalesce(${ratings.positive}, 0)`.mapWith(Number),
        negative: sql`coalesce(${ratings.negative}, 0)`.mapWith(Number),
      },
    })
    .from(schema.reviews)
    .leftJoin(ratings, eq(schema.reviews.id, ratings.reviewId));
};

export const getReviewsByMovieId = (movieId: number) => {
  return buildReviewWithRatingsQuery().where(
    eq(schema.reviews.movieId, movieId)
  );
};

export const getReviewsByOwner = (owner: string) => {
  return buildReviewWithRatingsQuery().where(eq(schema.reviews.owner, owner));
};

export const getReviewById = async (reviewId: number) => {
  const [result] = await buildReviewWithRatingsQuery()
    .where(eq(schema.reviews.id, reviewId))
    .limit(1);

  return result;
};
