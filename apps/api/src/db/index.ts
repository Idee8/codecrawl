import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable must be provided.');
}

const queryClient = postgres(process.env.DATABASE_URL);
export const db = drizzle({ client: queryClient, schema });
