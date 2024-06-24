import { getRatingsCountByReviewId } from 'src/app/db/ratings';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(
  _: Request,
  { params }: { params: { reviewId: string } }
) {
  const reviewId = parseInt(params.reviewId);
  const encoder = new TextEncoder();

  let intervalId: NodeJS.Timeout;

  const readable = new ReadableStream({
    start(controller) {
      const send = async () => {
        const result = await getRatingsCountByReviewId(reviewId);

        const data =
          result.length === 0
            ? { reviewId, positive: 0, negative: 0 }
            : result[0];

        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      send();

      intervalId = setInterval(send, 5000);
    },
    cancel() {
      clearInterval(intervalId);
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
      'Content-Encoding': 'none',
    },
  });
}
