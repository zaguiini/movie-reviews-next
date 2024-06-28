'use server';

import Pusher from 'pusher';
import {
  toggleRating as dbToggleRating,
  getRatingsCountByReviewId,
} from 'src/app/db/ratings';
import { getUser } from 'src/app/lib/auth';

export const toggleRating = async ({
  reviewId,
  outcome,
}: Omit<Parameters<typeof dbToggleRating>[0], 'user'>) => {
  const user = await getUser();

  await dbToggleRating({ user, outcome, reviewId });

  const [result] = await getRatingsCountByReviewId(reviewId);

  const ratings = {
    positive: result?.positive ?? 0,
    negative: result?.negative ?? 0,
  };

  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    secret: process.env.PUSHER_APP_SECRET!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
    useTLS: true,
  });

  pusher.trigger('rating-updates', reviewId.toString(), ratings);
};
