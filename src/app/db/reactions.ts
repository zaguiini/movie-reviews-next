import { and, count, eq, isNotNull } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { db, schema } from 'root/db/db';
import { getDate } from 'src/lib/get-date';

export const getReactionsByReviewId = (parentReviewId: number) => {
  return unstable_cache(
    (_parentReviewId: number) =>
      db.query.reviews.findMany({
        where: and(eq(schema.reviews.parentReviewId, _parentReviewId)),
      }),
    ['reactions', parentReviewId.toString()],
    { revalidate: false, tags: [`reactions:reviewId=${parentReviewId}`] }
  )(parentReviewId);
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
    ['reactionsCount', reviewId.toString()],
    { revalidate: false, tags: [`reactions:reviewId=${reviewId}`] }
  )(reviewId);
};

interface GetReactionParams {
  owner: string;
  parentReviewId: number;
}

export const getReaction = async ({
  owner,
  parentReviewId,
}: GetReactionParams) => {
  return unstable_cache(
    (_params: GetReactionParams) =>
      db.query.reviews.findFirst({
        where: and(
          eq(schema.reviews.owner, _params.owner),
          eq(schema.reviews.parentReviewId, _params.parentReviewId)
        ),
      }),
    ['reactionByOwner', owner, parentReviewId.toString()],
    {
      revalidate: false,
      tags: [`reactions:${parentReviewId}`],
    }
  )({ owner, parentReviewId });
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
