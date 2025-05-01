
import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import ws from 'ws';
import * as schema from '../shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL не указан в переменных окружения');
}

const sql = neon(process.env.DATABASE_URL, {
  webSocketConstructor: ws,
  fetchConnectionCache: true,
  useSecureWebSocket: true,
  pipelineConnect: 'transaction',
  poolSize: 5,
  connectionTimeoutMillis: 10000,
  host: new URL(process.env.DATABASE_URL).hostname,
});

export const db = drizzle(sql, { schema });
