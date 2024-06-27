import { inngest } from 'src/ingest/client';
import DailySummaryEmail from './template';
import { Resend } from 'resend';
import {
  getReviewsCountByDate,
  getReactionsCountByDate,
} from 'src/app/db/reviews';

export const sendDailySummaryEmail = inngest.createFunction(
  { id: 'send-daily-summary-email' },
  { cron: '0 0 * * *' },
  async ({ event, step }) => {
    await step.run('send-email', async () => {
      const date = new Date();
      date.setDate(date.getDate() - 1);

      const [numberOfReviews, numberOfReactions] = await Promise.all([
        getReviewsCountByDate({ date }),
        getReactionsCountByDate({ date }),
      ]);

      const resend = new Resend(process.env.RESEND_API_KEY);

      const { data, error } = await resend.emails.send({
        from: `Movies Review Next <movies.review.next@luisfelipezaguini.com>`,
        to: process.env.ADMIN_EMAILS?.split(',') ?? [],
        subject: 'Your daily summary',
        react: DailySummaryEmail({
          date,
          numberOfReactions,
          numberOfReviews,
        }),
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    });

    return { event };
  }
);
