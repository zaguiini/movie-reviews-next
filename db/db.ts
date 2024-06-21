import 'root/loadEnv';
import { sql } from '@vercel/postgres';
import postgres from 'postgres';
import { drizzle as vercelDrizzle } from 'drizzle-orm/vercel-postgres';
import { drizzle as localDrizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

const db =
  process.env.NODE_ENV === 'production'
    ? vercelDrizzle(sql, { schema, logger: true })
    : localDrizzle(postgres(process.env.POSTGRES_URL as string), {
        schema,
        logger: true,
      });

export { db, schema };
