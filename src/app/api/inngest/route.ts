import { serve } from 'inngest/next';
import { inngest } from 'src/ingest/client';
import { sendNewReactionEmail } from 'src/app/_background-jobs/send-new-reaction-email/handler';
import { sendDailySummaryEmail } from 'src/app/_background-jobs/send-daily-summary-email/handler';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [sendNewReactionEmail, sendDailySummaryEmail],
});
