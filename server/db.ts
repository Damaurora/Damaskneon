
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    require: true
  },
  maxRetries: 3,
  connectionTimeoutMillis: 10000,
  wsProxy: (url) => new ws(url, {
    headers: {
      host: new URL(process.env.DATABASE_URL).hostname
    },
    agent: undefined,
    rejectUnauthorized: false
  })
});

export const db = drizzle(pool, { schema });
