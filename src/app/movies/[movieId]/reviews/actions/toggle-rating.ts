'use server';

import { toggleRating as dbToggleRating } from 'src/app/db/ratings';
import { getUser } from 'src/app/lib/auth';

export const toggleRating = async ({
  reviewId,
  outcome,
}: Omit<Parameters<typeof dbToggleRating>[0], 'user'>) => {
  const user = await getUser();

  return dbToggleRating({ user, outcome, reviewId });
};
