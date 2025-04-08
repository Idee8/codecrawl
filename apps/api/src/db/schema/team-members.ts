import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { teams } from './teams';
import { users } from './users';

export const teamMembers = pgTable('team_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  teamId: uuid('team_id').references(() => teams.id),
  userId: uuid('user_id').references(() => users.id),
  role: varchar('role'),
  createdAt: timestamp('created_at').defaultNow(),
});
