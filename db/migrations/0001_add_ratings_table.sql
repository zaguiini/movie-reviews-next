DO $$ BEGIN
 CREATE TYPE "public"."outcome" AS ENUM('positive', 'negative');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"review_id" integer,
	"owner" text NOT NULL,
	"outcome" "outcome" NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ratings_review_id_owner_unique" UNIQUE("review_id","owner")
);
