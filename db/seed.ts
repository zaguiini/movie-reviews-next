import 'root/loadEnv';
import { db, schema } from './db';

const seed = async () => {
  await db
    .insert(schema.reviews)
    .values([
      {
        owner: 'luisfelipezaguini@gmail.com',
        movieId: 1022789,
        title: 'Fine movie',
        review: `I really liked that movie! I wonder how we've got this far as a species?`,
      },
    ])
    .onConflictDoNothing();

  await db
    .insert(schema.ratings)
    .values([
      {
        owner: 'seconduser@gmail.com',
        reviewId: 1,
        outcome: 'positive',
      },
    ])
    .onConflictDoNothing();

  await db.insert(schema.reviews).values([
    {
      owner: 'elzaga@ok.com',
      movieId: 1022789,
      title: 'What?',
      review:
        'Are you a 10 year old? You should not be on the internet at this age. Go touch some grass...',
      parentReviewId: 1,
    },
  ]);
};

async function run() {
  await seed();
  console.log('Database seeded.');
  process.exit(0);
}

run();
