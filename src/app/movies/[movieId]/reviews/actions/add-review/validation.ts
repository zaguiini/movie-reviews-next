import { z } from 'zod';

export const reviewForm = z.object({
  movieId: z.number(),
  title: z.string(),
  review: z.string().min(32),
});

export type ReviewFormData = z.infer<typeof reviewForm>;
