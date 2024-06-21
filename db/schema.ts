import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';

export const ReviewsTable = pgTable(
  'reviews',
  {
    id: serial('id').primaryKey(),
    movieId: integer('movie_id').notNull(),
    owner: text('owner').notNull(),
    title: text('title').notNull(),
    review: text('review').notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  },
  (reviews) => ({
    unq: unique().on(reviews.movieId, reviews.owner),
  })
);
