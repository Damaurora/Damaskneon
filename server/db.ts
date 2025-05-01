
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
  connect_timeout: 30,
  wsProxy: (url) => new ws(url, {
    headers: {
      'host': new URL(process.env.DATABASE_URL).hostname
    },
    rejectUnauthorized: false,
    timeout: 30000
  })
});

export const db = drizzle(pool, { schema });
