import {
  Html,
  Head,
  Body,
  Preview,
  Tailwind,
  Text,
  Link,
} from '@react-email/components';

interface NewReactionEmailProps {
  reviewOwner: string;
  reviewLink: string;
  reactionExcerpt: string;
  reactionLink: string;
}

export default function NewReactionEmail({
  reviewOwner,
  reviewLink,
  reactionExcerpt,
  reactionLink,
}: NewReactionEmailProps) {
  return (
    <Html lang='en'>
      <Head></Head>
      <Preview>New reaction to your review!</Preview>
      <Tailwind>
        <Body className='font-sans'>
          <Text>Hi, {reviewOwner}!</Text>
          <Text>
            Your{' '}
            <Link className='underline hover:no-underline' href={reviewLink}>
              review
            </Link>{' '}
            got a new{' '}
            <Link className='underline hover:no-underline' href={reactionLink}>
              reaction
            </Link>
            :
          </Text>
          <blockquote className='ml-4 flex items-center gap-4'>
            {reactionExcerpt}
          </blockquote>
          <Text>
            <Link className='underline hover:no-underline' href={reactionLink}>
              Read reaction
            </Link>
            .
          </Text>
          <Text>Cheers, Movie Reviews Next</Text>
        </Body>
      </Tailwind>
    </Html>
  );
}

NewReactionEmail.PreviewProps = {
  reviewOwner: 'reviewowner',
  reviewLink: 'http://localhost:3000/movies/1/reviews/1',
  reactionExcerpt: 'honestly, i did not like what you said...',
  reactionLink: 'http://localhost:3000/movies/1/reviews/2',
};
