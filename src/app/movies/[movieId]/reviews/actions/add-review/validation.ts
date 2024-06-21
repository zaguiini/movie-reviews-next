import { InferInsertModel } from 'drizzle-orm';
import { z } from 'zod';
import { schema } from 'root/db/db';

type ReviewFormFields = Omit<
  InferInsertModel<typeof schema.reviews>,
  'id' | 'owner' | 'createdAt'
>;

export const reviewForm: z.ZodType<
  ReviewFormFields,
  z.ZodTypeDef,
  ReviewFormFields
> = z.object({
  movieId: z.number(),
  title: z.string(),
  review: z.string().min(32),
});

export type ReviewFormData = z.infer<typeof reviewForm>;
