CREATE TABLE IF NOT EXISTS "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"movie_id" integer NOT NULL,
	"owner" text NOT NULL,
	"title" text NOT NULL,
	"review" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "reviews_movie_id_owner_unique" UNIQUE("movie_id","owner")
);
