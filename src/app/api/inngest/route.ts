import { serve } from 'inngest/next';
import { inngest } from 'src/ingest/client';
import { sendNewReactionEmail } from 'src/app/_background-jobs/send-new-reaction-email';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [sendNewReactionEmail],
});
