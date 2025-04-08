import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { teams } from './teams';

export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: text('key'),
  name: varchar('name', { length: 100 }),
  teamId: uuid('team_id').references(() => teams.id),
  lastUsedAt: timestamp('last_used_at'),
  createdAt: timestamp('created_at').defaultNow(),
});
