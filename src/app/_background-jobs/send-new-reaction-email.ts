import { inngest } from '../../ingest/client';

export const sendNewReactionEmail = inngest.createFunction(
  { id: 'send-new-reaction-email' },
  { event: 'reviews/send.new.reaction.email' },
  async ({ event, step }) => {
    await step.sleep('wait-a-moment', '1s');
    return { event, body: 'Hello, World!' };
  }
);
