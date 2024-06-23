import { EventSchemas, Inngest } from 'inngest';
import { z } from 'zod';

export const inngest = new Inngest({
  id: 'movie-reviews',
  schemas: new EventSchemas().fromZod({
    'reviews/send.new.reaction.email': {
      data: z.object({
        reviewId: z.number(),
      }),
    },
  }),
});
