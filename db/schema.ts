import { relations } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';

export const reviews = pgTable(
  'reviews',
  {
    id: serial('id').primaryKey(),
    movieId: integer('movie_id').notNull(),
    owner: text('owner').notNull(),
    title: text('title').notNull(),
    review: text('review').notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    parentReviewId: integer('parent_review_id'),
  },
  (reviews) => ({
    unique_reaction_by_review_by_movie: unique()
      .on(reviews.movieId, reviews.owner, reviews.parentReviewId)
      .nullsNotDistinct(),
  })
);

export const reviewsRelations = relations(reviews, ({ many, one }) => ({
  ratings: many(ratings),
  parentReview: one(reviews, {
    fields: [reviews.parentReviewId],
    references: [reviews.id],
  }),
}));

export const outcomeEnum = pgEnum('outcome', ['positive', 'negative']);

export const ratings = pgTable(
  'ratings',
  {
    id: serial('id').primaryKey(),
    reviewId: integer('review_id'),
    owner: text('owner').notNull(),
    outcome: outcomeEnum('outcome').notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  },
  (ratings) => ({
    unq: unique().on(ratings.reviewId, ratings.owner),
  })
);

export const ratingsRelations = relations(ratings, ({ one }) => ({
  review: one(reviews, {
    fields: [ratings.reviewId],
    references: [reviews.id],
  }),
}));
