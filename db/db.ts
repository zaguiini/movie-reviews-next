import { drizzle as vercelDrizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';

import { drizzle as nonVercelDrizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';

import * as schema from './schema';

function getDatabaseConnection() {
  const options = {
    schema,
    logger: true,
  };

  if (process.env.VERCEL_ENV) {
    return vercelDrizzle(sql, options);
  }

  // Set the WebSocket proxy to work with the local instance
  neonConfig.wsProxy = (host) => `${host}:5433/v1`;

  // Disable all authentication and encryption
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;

  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });

  return nonVercelDrizzle(pool, options);
}

const db = getDatabaseConnection();

export { db, schema };
