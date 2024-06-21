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
};

async function run() {
  await seed();
  console.log('Database seeded.');
  process.exit(0);
}

run();
