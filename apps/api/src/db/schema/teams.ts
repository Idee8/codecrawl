import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';

export const teams = pgTable('teams', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name').notNull(),
  ownerId: uuid('owner_id').references(() => users.id),
  slug: text(''),
  createdAt: timestamp('created_at').defaultNow(),
});
