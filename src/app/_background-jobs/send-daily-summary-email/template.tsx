import { Html, Head, Body, Tailwind, Text } from '@react-email/components';

interface NewReactionEmailProps {
  date: Date;
  numberOfReviews: number;
  numberOfReactions: number;
}

export default function DailySummaryEmail({
  date,
  numberOfReviews,
  numberOfReactions,
}: NewReactionEmailProps) {
  return (
    <Html lang='en'>
      <Head></Head>
      <Tailwind>
        <Body className='font-sans'>
          <Text>Hi, Administrator!</Text>
          <Text>
            Here&apos;s the activity summary for{' '}
            {new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(
              date
            )}
            :
          </Text>
          <blockquote>
            <Text>New reviews: {numberOfReviews}</Text>
            <Text>New reactions: {numberOfReactions}</Text>
          </blockquote>
          <Text>Cheers, Movie Reviews Next</Text>
        </Body>
      </Tailwind>
    </Html>
  );
}

DailySummaryEmail.PreviewProps = {
  date: new Date(),
  numberOfReviews: 3,
  numberOfReactions: 3,
};
