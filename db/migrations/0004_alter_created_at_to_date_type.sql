ALTER TABLE "ratings" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "reviews" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "ratings" ALTER COLUMN "created_at" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "created_at" SET DATA TYPE date;